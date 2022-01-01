import { Component, OnInit } from '@angular/core';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = []
  displayedColumns: string[] = ['name', 'category']
  load: boolean = false;

  constructor(private service: CoursesService) { }

  ngOnInit(): void {
    this.load = true;
    this.service.list().subscribe(
      (resposta: Course[]) => {
        this.courses = resposta;
        this.load = false;
      }
    );
  }

}
