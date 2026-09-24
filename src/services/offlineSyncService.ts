import localforage from 'localforage';
import { ClinicalCase } from '../types';

const SYNC_QUEUE_KEY = 'arogyaseva_offline_cases_queue';

localforage.config({
  name: 'ArogyaSevaDB',
  storeName: 'offline_queue'
});

export class OfflineSyncService {
  public static async queueCaseForSync(newCase: ClinicalCase): Promise<void> {
    const queue = (await localforage.getItem<ClinicalCase[]>(SYNC_QUEUE_KEY)) || [];
    const updatedQueue = [...queue, { ...newCase, isSynced: false }];
    await localforage.setItem(SYNC_QUEUE_KEY, updatedQueue);
  }

  public static async getPendingQueue(): Promise<ClinicalCase[]> {
    const queue = await localforage.getItem<ClinicalCase[]>(SYNC_QUEUE_KEY);
    return queue || [];
  }

  public static async clearSyncedCase(caseId: string): Promise<void> {
    const queue = (await localforage.getItem<ClinicalCase[]>(SYNC_QUEUE_KEY)) || [];
    const updatedQueue = queue.filter((c) => c.id !== caseId);
    await localforage.setItem(SYNC_QUEUE_KEY, updatedQueue);
  }

  public static async getPendingCount(): Promise<number> {
    const queue = await this.getPendingQueue();
    return queue.length;
  }
}
