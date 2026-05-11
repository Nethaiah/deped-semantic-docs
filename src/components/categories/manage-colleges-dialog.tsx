"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  X,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-context";

import {
  invalidateTaxonomy,
  useTaxonomy,
  type ClientCollege,
  type ClientDepartment,
} from "@/hooks/use-taxonomy";
import {
  createCollege,
  updateCollege,
  deleteCollege,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/server/categories/manage-taxonomy";
import type { CollegeRow } from "@/server/categories/taxonomy";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTaxonomy: CollegeRow[];
};

/**
 * Two-pane CRUD for the colleges/departments taxonomy.
 *
 * Left pane lists colleges with inline edit + add + delete; right pane
 * shows the departments of the currently-selected college.  Mutations
 * call ``"use server"`` actions which run admin checks, mutate Supabase,
 * and revalidate the ``colleges-taxonomy`` cache tag.  After every
 * successful mutation we ``router.refresh()`` so the categories grid
 * (and any other server component using the taxonomy) reflects the
 * change immediately.
 */
export default function ManageCollegesDialog({
  open,
  onOpenChange,
  initialTaxonomy,
}: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const { taxonomy: liveTaxonomy, refresh } = useTaxonomy();

  const colleges: ClientCollege[] = useMemo(() => {
    if (liveTaxonomy && liveTaxonomy.length > 0) return liveTaxonomy;
    return initialTaxonomy.map((c) => ({
      code: c.code,
      full_name: c.full_name,
      description: c.description,
      sort_order: c.sort_order,
      departments: c.departments.map((d) => ({
        id: d.id,
        name: d.name,
        keywords: d.keywords,
        sort_order: d.sort_order,
      })),
    }));
  }, [liveTaxonomy, initialTaxonomy]);

  const [selectedCode, setSelectedCode] = useState<string | null>(
    colleges[0]?.code ?? null
  );

  // Refresh client-side cache when the dialog opens so admin always
  // sees the latest data even if it changed in another tab.
  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  // Make sure the selection stays valid when the list changes.
  useEffect(() => {
    if (colleges.length === 0) {
      setSelectedCode(null);
      return;
    }
    if (!selectedCode || !colleges.find((c) => c.code === selectedCode)) {
      setSelectedCode(colleges[0].code);
    }
  }, [colleges, selectedCode]);

  const selectedCollege = colleges.find((c) => c.code === selectedCode) ?? null;

  const [isPending, startTransition] = useTransition();

  type ActionReturn = { error: string } | { success: true; [k: string]: unknown };

  const reflect = async (action: () => Promise<ActionReturn>) => {
    let result: ActionReturn;
    try {
      result = await action();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      toast.error(msg);
      return false;
    }
    const errorMessage = (result as { error?: string }).error;
    if (errorMessage) {
      toast.error(errorMessage);
      return false;
    }
    invalidateTaxonomy();
    await refresh();
    router.refresh();
    return true;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Manage Colleges &amp; Departments
            </DialogTitle>
            <DialogDescription>
              Add, rename, or remove colleges and their departments. Changes
              affect the entire system: AI metadata extraction, filters, and
              the public categories grid.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 max-h-[60vh] overflow-hidden">
            {/* ── Colleges pane ── */}
            <div className="flex flex-col min-h-0 border rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-white rounded-t-lg">
                <h3 className="text-sm font-semibold text-slate-700">
                  Colleges
                </h3>
                <CollegeCreateButton
                  onCreate={async (input) => {
                    const ok = await reflect(() =>
                      startTransitionPromise(startTransition, () =>
                        createCollege(input)
                      )
                    );
                    if (ok) {
                      toast.success(`Created ${input.code}`);
                      setSelectedCode(input.code.toUpperCase());
                    }
                  }}
                  disabled={isPending}
                />
              </div>
              <ul className="overflow-y-auto flex-1 divide-y">
                {colleges.length === 0 ? (
                  <li className="px-3 py-6 text-sm text-slate-500 text-center">
                    No colleges yet. Add the first one to get started.
                  </li>
                ) : (
                  colleges.map((c) => (
                    <CollegeListItem
                      key={c.code}
                      college={c}
                      isSelected={c.code === selectedCode}
                      isPending={isPending}
                      themeBg={theme.primaryBgClass}
                      onSelect={() => setSelectedCode(c.code)}
                      onUpdate={async (patch) => {
                        const ok = await reflect(() =>
                          startTransitionPromise(startTransition, () =>
                            updateCollege({ code: c.code, ...patch })
                          )
                        );
                        if (ok) toast.success(`Updated ${c.code}`);
                      }}
                      onDelete={async () => {
                        const ok = await reflect(() =>
                          startTransitionPromise(startTransition, () =>
                            deleteCollege({ code: c.code })
                          )
                        );
                        if (ok) toast.success(`Deleted ${c.code}`);
                      }}
                    />
                  ))
                )}
              </ul>
            </div>

            {/* ── Departments pane ── */}
            <div className="flex flex-col min-h-0 border rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-white rounded-t-lg">
                <h3 className="text-sm font-semibold text-slate-700">
                  {selectedCollege
                    ? `Departments of ${selectedCollege.code}`
                    : "Departments"}
                </h3>
                {selectedCollege && (
                  <DepartmentCreateButton
                    disabled={isPending}
                    onCreate={async (input) => {
                      const ok = await reflect(() =>
                        startTransitionPromise(startTransition, () =>
                          createDepartment({
                            collegeCode: selectedCollege.code,
                            ...input,
                          })
                        )
                      );
                      if (ok) toast.success(`Added ${input.name}`);
                    }}
                  />
                )}
              </div>
              <ul className="overflow-y-auto flex-1 divide-y">
                {!selectedCollege ? (
                  <li className="px-3 py-6 text-sm text-slate-500 text-center">
                    Select a college to view its departments.
                  </li>
                ) : selectedCollege.departments.length === 0 ? (
                  <li className="px-3 py-6 text-sm text-slate-500 text-center">
                    No departments yet. Add one with the &ldquo;+&rdquo;
                    button above.
                  </li>
                ) : (
                  selectedCollege.departments.map((d) => (
                    <DepartmentListItem
                      key={d.id}
                      department={d}
                      isPending={isPending}
                      onUpdate={async (patch) => {
                        const ok = await reflect(() =>
                          startTransitionPromise(startTransition, () =>
                            updateDepartment({ id: d.id, ...patch })
                          )
                        );
                        if (ok) toast.success(`Updated ${d.name}`);
                      }}
                      onDelete={async () => {
                        const ok = await reflect(() =>
                          startTransitionPromise(startTransition, () =>
                            deleteDepartment({ id: d.id })
                          )
                        );
                        if (ok) toast.success(`Deleted ${d.name}`);
                      }}
                    />
                  ))
                )}
              </ul>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Internal pieces
// ---------------------------------------------------------------------------

function startTransitionPromise<T>(
  startTransition: (cb: () => void) => void,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    startTransition(() => {
      fn().then(resolve).catch(reject);
    });
  });
}

// ── Colleges ────────────────────────────────────────────────────────────────

function CollegeCreateButton({
  onCreate,
  disabled,
}: {
  disabled: boolean;
  onCreate: (input: { code: string; fullName: string; description?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCode("");
    setFullName("");
    setDescription("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onCreate({
        code: code.trim().toUpperCase(),
        fullName: fullName.trim(),
        description: description.trim() || undefined,
      });
      reset();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 cursor-pointer"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" /> Add
      </Button>
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>Add College</DialogTitle>
          <DialogDescription>
            The code is the canonical identifier used by the AI extraction
            pipeline (e.g., <code>CCS</code>).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="college-code" className="text-xs">Code</Label>
            <Input
              id="college-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. CAS"
              maxLength={12}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="college-name" className="text-xs">Full name</Label>
            <Input
              id="college-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. College of Arts and Sciences"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="college-desc" className="text-xs">
              Description <span className="text-slate-400">(optional)</span>
            </Label>
            <Input
              id="college-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short blurb shown only to admins"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !code.trim() || fullName.trim().length < 2}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create college"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CollegeListItem({
  college,
  isSelected,
  isPending,
  themeBg,
  onSelect,
  onUpdate,
  onDelete,
}: {
  college: ClientCollege;
  isSelected: boolean;
  isPending: boolean;
  themeBg: string;
  onSelect: () => void;
  onUpdate: (patch: { fullName?: string; sortOrder?: number }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(college.full_name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startEdit = () => {
    setName(college.full_name);
    setEditing(true);
  };

  const save = async () => {
    if (name.trim().length < 2) return;
    await onUpdate({ fullName: name.trim() });
    setEditing(false);
  };

  return (
    <li
      className={`px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-colors ${
        isSelected ? `${themeBg} text-white` : "hover:bg-slate-100"
      }`}
      onClick={() => !editing && onSelect()}
    >
      <div className="flex-1 min-w-0">
        {editing ? (
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") void save();
              if (e.key === "Escape") setEditing(false);
            }}
            className="h-8 text-sm"
          />
        ) : (
          <>
            <div className="text-sm font-semibold truncate">{college.code}</div>
            <div
              className={`text-xs truncate ${isSelected ? "text-white/80" : "text-slate-500"}`}
            >
              {college.full_name}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {editing ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={isPending || name.trim().length < 2}
              onClick={(e) => {
                e.stopPropagation();
                void save();
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${isSelected ? "hover:bg-white/20 text-white" : ""}`}
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                startEdit();
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${
                isSelected ? "hover:bg-white/20 text-white" : "text-red-500 hover:bg-red-50"
              }`}
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {college.code}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the college <strong>{college.code}</strong> and all
              of its departments. The action will be refused if any thesis
              still references this college.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={async () => {
                await onDelete();
                setConfirmDelete(false);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete college
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}

// ── Departments ─────────────────────────────────────────────────────────────

function DepartmentCreateButton({
  onCreate,
  disabled,
}: {
  disabled: boolean;
  onCreate: (input: { name: string; keywords: string[] }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setKeywords("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        keywords: keywords
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean),
      });
      reset();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 cursor-pointer"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" /> Add
      </Button>
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            Keywords help the AI extraction match noisy department names from
            uploaded PDFs (e.g. <em>“BSCS”</em> → <em>Computer Science</em>).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="department-name" className="text-xs">Department name</Label>
            <Input
              id="department-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="department-keywords" className="text-xs">
              Match keywords <span className="text-slate-400">(comma-separated, optional)</span>
            </Label>
            <Input
              id="department-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. computer science, cs, bscs"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || name.trim().length < 2}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DepartmentListItem({
  department,
  isPending,
  onUpdate,
  onDelete,
}: {
  department: ClientDepartment;
  isPending: boolean;
  onUpdate: (patch: { name?: string; keywords?: string[] }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(department.name);
  const [keywords, setKeywords] = useState(department.keywords.join(", "));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startEdit = () => {
    setName(department.name);
    setKeywords(department.keywords.join(", "));
    setEditing(true);
  };

  const save = async () => {
    if (name.trim().length < 2) return;
    await onUpdate({
      name: name.trim(),
      keywords: keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean),
    });
    setEditing(false);
  };

  return (
    <li className="px-3 py-2.5 hover:bg-slate-100 transition-colors">
      {editing ? (
        <div className="space-y-2">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-sm"
            placeholder="Department name"
          />
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="h-8 text-xs"
            placeholder="Match keywords (comma-separated)"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              className="h-7 text-xs"
              disabled={isPending || name.trim().length < 2}
              onClick={() => void save()}
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-800 truncate">
              {department.name}
            </div>
            {department.keywords.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {department.keywords.map((k) => (
                  <Badge
                    key={k}
                    variant="secondary"
                    appearance="light"
                    size="sm"
                  >
                    {k}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={isPending}
              onClick={startEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:bg-red-50"
              disabled={isPending}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {department.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the department from the taxonomy. Refused if
              any thesis still references it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={async () => {
                await onDelete();
                setConfirmDelete(false);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
