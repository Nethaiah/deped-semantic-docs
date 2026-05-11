"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-context";
import ManageCollegesDialog from "@/components/categories/manage-colleges-dialog";
import type { CollegeRow } from "@/server/categories/taxonomy";

type Props = {
  taxonomy: CollegeRow[];
};

/**
 * Renders the "Manage Colleges" launcher used on the categories page.
 *
 * The page server-component decides whether to render this component at
 * all (admins only).  Once mounted, it owns the dialog open/close state
 * and forwards the initial taxonomy snapshot down to the dialog so the
 * admin sees the same list that's currently on screen.
 */
export default function CategoriesAdminToolbar({ taxonomy }: Props) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={`gap-2 ${theme.primaryBgClass} ${theme.primaryHoverBgClass} cursor-pointer text-white shadow-sm`}
      >
        <Settings2 className="h-4 w-4" />
        Manage Colleges
      </Button>

      <ManageCollegesDialog
        open={open}
        onOpenChange={setOpen}
        initialTaxonomy={taxonomy}
      />
    </>
  );
}
