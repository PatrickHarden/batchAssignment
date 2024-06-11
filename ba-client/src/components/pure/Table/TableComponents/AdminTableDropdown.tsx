import React from 'react';
import Dropdown, { type MenuContent } from '../../Dropdown/Dropdown';
import type { Status } from '../../../../hooks/apis/use-students-api';
import { type AdminAssessmentData } from '../../../container/HomePage/Admin/TableColumnDefinitions';
import { type DialogTypes, adminOpenDialog } from '../../../../atoms/atoms';
import { useSetAtom } from 'jotai';

interface TableDropdownProps {
  tableData: AdminAssessmentData;
  placeholder?: string;
  index?: number;
}

// this will determine which actions to render depending on data/route conditions
export default function AdminTableDropdown({ index, placeholder, tableData }: TableDropdownProps) {
  const setOpenDialog = useSetAtom(adminOpenDialog);
  const content: MenuContent[] = [];

  const editOptions: Status[] = ['NOT_STARTED', 'SCHEDULED'];
  const cancelOptions: Status[] = ['IN_PROGRESS', 'SCHEDULED', 'NOT_STARTED'];
  if (tableData.status && editOptions.includes(tableData.status)) {
    content.push({ title: 'Edit Test', id: 'edit' });
  }
  if (tableData.status && cancelOptions.includes(tableData.status)) {
    content.push({ title: 'Cancel Test', id: 'cancel' });
  }

  const handleDialogChange = (filter: string, values: string[]) => {
    if (values[0] === 'Edit Test' || values[0] === 'Cancel Test') {
      setOpenDialog({
        data: tableData,
        index: index,
        dialogType: (values[0] === 'Edit Test' ? 'edit' : 'cancel') as DialogTypes
      });
    }
  };

  return content.length > 0 ? (
    <Dropdown
      content={content}
      header={`tableDropdown-${index}`}
      placeholder={placeholder}
      onChange={handleDialogChange}
      hasSelectedValues={false}
      tableStyling
    />
  ) : null;
}
