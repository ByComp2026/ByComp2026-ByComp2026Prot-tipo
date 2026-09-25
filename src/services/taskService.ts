import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Task, TaskStatus, ActivityRecord } from '../types';

class TaskService {
  private tasksInitialized = false;

  // Listen to tasks in real time from Firestore
  public subscribeTasks(callback: (tasks: Task[]) => void): () => void {
    const tasksCol = collection(db, 'tasks');

    return onSnapshot(
      tasksCol,
      (snapshot) => {
        const tasks: Task[] = [];
        snapshot.forEach((d) => {
          tasks.push(d.data() as Task);
        });
        callback(tasks);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'tasks');
      }
    );
  }

  // Create a new Task in Firestore
  public async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTask: Task = {
      ...taskData,
      id: taskId
    };

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await setDoc(taskRef, newTask);
      console.log('Task created in Firestore:', taskId);
      return newTask;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `tasks/${taskId}`);
      throw error;
    }
  }

  // Update Task Status (Drag & Drop in Kanban)
  public async updateTaskStatus(taskId: string, targetStatus: TaskStatus): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await setDoc(taskRef, { status: targetStatus }, { merge: true });
      console.log(`Task ${taskId} status updated to ${targetStatus} in Firestore`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  }

  // Update Task fields
  public async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await setDoc(taskRef, updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  }

  // Delete Task
  public async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      console.log('Task deleted from Firestore:', taskId);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  }

  // ==========================================
  // ACTIVITIES (Base de Atividades & Horas)
  // ==========================================

  public subscribeActivities(callback: (activities: ActivityRecord[]) => void): () => void {
    const actCol = collection(db, 'activities');

    return onSnapshot(
      actCol,
      (snapshot) => {
        const activities: ActivityRecord[] = [];
        snapshot.forEach((d) => {
          activities.push(d.data() as ActivityRecord);
        });
        callback(activities);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'activities');
      }
    );
  }

  public async createActivity(actData: Omit<ActivityRecord, 'id'>): Promise<ActivityRecord> {
    const actId = `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newActivity: ActivityRecord = {
      ...actData,
      id: actId
    };

    try {
      const actRef = doc(db, 'activities', actId);
      await setDoc(actRef, newActivity);
      console.log('Activity saved to Firestore:', actId);
      return newActivity;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `activities/${actId}`);
      throw error;
    }
  }

  public async deleteActivity(actId: string): Promise<void> {
    try {
      const actRef = doc(db, 'activities', actId);
      await deleteDoc(actRef);
      console.log('Activity deleted from Firestore:', actId);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `activities/${actId}`);
    }
  }
}

export const taskService = new TaskService();
