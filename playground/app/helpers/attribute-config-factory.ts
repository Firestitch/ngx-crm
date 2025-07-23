import {
  FsAttributeConfig,
} from '@firestitch/attribute';
import { FlatItemNode } from '@firestitch/tree';

import { of } from 'rxjs';

export function attributeConfigFactory(): FsAttributeConfig {
  const config: FsAttributeConfig = {
    configs: [],
    mapping: {
      id: 'id',
      name: 'name',
      image: 'image.tiny',
      backgroundColor: 'backgroundColor',
      childAttributes: 'childAttributes',
    },
    getAttributeTree: (e) => {
      return of(null);
    },
    reorderAttributeTree: (event: any) => {
      return of(null);
    },
    canDropTreeAttribute: (
      node?: FlatItemNode,
      fromParent?: FlatItemNode,
      toParent?: FlatItemNode,
      dropPosition?: any,
      prevElement?: FlatItemNode,
      nextElement?: FlatItemNode,
    ) => {
      return true;
    },
    sortByAttributeTree: (data, parent) => {
      if (!parent) {
        return data;
      }

      return data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (b.name < b.name) {
          return 1;
        }

        return 0;
      });
    },
    saveAttribute: (e) => {
      return of(e);
    },
    saveAttributeImage: (e) => {
      return of(e);
    },
    getAttributes: (e) => {
      return of(null);
    },
    getSelectedAttributes: (e) => {
      return of(e);
    },
    reorderAttributes: (e) => {
      return of(e);
    },
    attributeSelectionChanged: (e) => {
      return of(e);
    },
    deleteAttribute: (e) => {
      return of(e);
    },
    compareAttributes: (o1, o2) => {
      return o1 && o2 && o1.id === o2.id;
    },
  };

  return config;
}
