import { Routes } from '@angular/router';

import { CourseFormComponent } from './containers/course-form/course-form.component';
import { CoursesComponent } from './containers/courses/courses.component';
import { CoursesResolver } from './guards/courses.resolver';

export const COURSES_ROUTES: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'new', component: CourseFormComponent, resolve: { course: CoursesResolver}  },
  { path: 'edit/:id', component: CourseFormComponent, resolve: { course: CoursesResolver} }
];
