import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first, take } from 'rxjs';

import { Course } from '../model/course';
import { CoursePage } from '../model/course-page';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '/api/courses';

  constructor(private httpClient: HttpClient) { }

  list(page: number = 0, pageSize: number = 10): any {
    return this.httpClient.get<CoursePage[]>(`${this.API}`, { params: { page, pageSize } }).pipe(first(), delay(1000));
  }

  save(record: Partial<Course>): any {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  loadById(id: string): any {
    return this.httpClient.get<Course>(`${this.API}/${id}`).pipe(first());
  }

  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(`${this.API}`, record).pipe(take(1));
  }

  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record).pipe(first());
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

}
