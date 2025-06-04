import { FsFile } from '@firestitch/file';


export interface AddActivityMenuItem {
  label: string;
  type?: 'file' | 'default';
  items?: AddActivityMenuItem[];
  multiple?: boolean;
  fileSelected?: (files: FsFile[] | FsFile) => void;
  click?: () => void;
}
