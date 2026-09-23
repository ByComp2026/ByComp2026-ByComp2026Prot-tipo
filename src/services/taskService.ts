import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Task, TaskStatus, Priority, Sector, ActivityRecord } from '../types';
import { INITIAL_TASKS, SMART_SPREADSHEET_DATA } from '../data/mockData';
import { INITIAL_FORM_SUBMISSIONS } from '../data/formSubmissions';
import { FormSubmissionRecord } from '../utils/excelExport';

class TaskService {
  private tasksInitialized = false;
  private activitiesInitialized = false;
  private submissionsInitialized = false;

  // Listen to tasks in real time from Firestore
  public subscribeTasks(callback: (tasks: Task[]) => void): () => void {
    const tasksCol = collection(db, 'tasks');

    return onSnapshot(
      tasksCol,
      async (snapshot) => {
        if (snapshot.empty && !this.tasksInitialized) {
          this.tasksInitialized = true;
          // Seed initial tasks to Firestore so boards are populated
          await this.seedInitialTasks();
          return;
        }

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

  // Seed initial tasks to Firestore once
  public async seedInitialTasks(): Promise<void> {
    try {
      const batchPromises = INITIAL_TASKS.map((task) => {
        const taskRef = doc(db, 'tasks', task.id);
        return setDoc(taskRef, task);
      });
      await Promise.all(batchPromises);
      console.log('Initial Kanban tasks seeded to Firebase Firestore');
    } catch (err) {
      console.warn('Error seeding initial tasks:', err);
    }
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
      async (snapshot) => {
        if (snapshot.empty && !this.activitiesInitialized) {
          this.activitiesInitialized = true;
          await this.seedInitialActivities();
          return;
        }

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

  public async seedInitialActivities(): Promise<void> {
    try {
      const batchPromises = SMART_SPREADSHEET_DATA.slice(0, 15).map((act) => {
        const actRef = doc(db, 'activities', act.id);
        return setDoc(actRef, act);
      });
      await Promise.all(batchPromises);
      console.log('Initial activities seeded to Firebase Firestore');
    } catch (err) {
      console.warn('Error seeding initial activities:', err);
    }
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

  // ==========================================
  // FORM SUBMISSIONS (Formulários & Banco)
  // ==========================================

  public subscribeSubmissions(callback: (submissions: FormSubmissionRecord[]) => void): () => void {
    const subCol = collection(db, 'form_submissions');

    return onSnapshot(
      subCol,
      async (snapshot) => {
        if (snapshot.empty && !this.submissionsInitialized) {
          this.submissionsInitialized = true;
          await this.seedInitialSubmissions();
          return;
        }

        const submissions: FormSubmissionRecord[] = [];
        snapshot.forEach((d) => {
          submissions.push(d.data() as FormSubmissionRecord);
        });
        callback(submissions);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'form_submissions');
      }
    );
  }

  public async seedInitialSubmissions(): Promise<void> {
    try {
      const batchPromises = INITIAL_FORM_SUBMISSIONS.slice(0, 12).map((sub) => {
        const subRef = doc(db, 'form_submissions', sub.id);
        return setDoc(subRef, sub);
      });
      await Promise.all(batchPromises);
      console.log('Initial form submissions seeded to Firebase Firestore');
    } catch (err) {
      console.warn('Error seeding initial submissions:', err);
    }
  }

  public async createSubmission(submissionData: Omit<FormSubmissionRecord, 'id'>): Promise<FormSubmissionRecord> {
    const subId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newSubmission: FormSubmissionRecord = {
      ...submissionData,
      id: subId
    };

    try {
      const subRef = doc(db, 'form_submissions', subId);
      await setDoc(subRef, newSubmission);
      console.log('Submission saved to Firestore:', subId);
      return newSubmission;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `form_submissions/${subId}`);
      throw error;
    }
  }
}

export const taskService = new TaskService();
