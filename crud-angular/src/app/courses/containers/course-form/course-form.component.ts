import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { Lesson } from '../../model/lesson';
import { CoursesService } from '../../services/courses.service';
import { Course } from './../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({
      _id: [course._id],
      name: [course.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      category: [course.category, [Validators.required]],
      lessons: this.formBuilder.array(this.retriveLessons(course), Validators.required)
    });
    console.log(this.form);
    console.log(this.form.value);
  }

  private retriveLessons(course: Course): FormGroup[] {
    const lessons = [];
    if (course?.lessons) {
      course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)));
    } else {
      lessons.push(this.createLesson());
    }

    return lessons;
  }

  private createLesson(lesson: Lesson = { id: '', name: '', youtubeURL: '' }): FormGroup {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      youtubeUrl: [lesson.youtubeURL, [Validators.required, Validators.minLength(10), Validators.maxLength(11)]]
    });
  }

  getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  addNewLessons() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLessons(index: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  onSubmit() {
    if(this.form.valid) {
      this.service.save(this.form.value).subscribe(
        (_: any) => this.onSuccess(),
        (_: any) => this.onError()
      );
    } else {
      alert('Form invalido.');
    }

  }

  onCancel() {
    this.router.navigate(['courses']);
  }

  private onSuccess() {
    this._snackBar.open("Curso salvo com sucesso.", '', { duration: 5000 });
    this.router.navigate(['courses']);
  }

  private onError() {
    this._snackBar.open("Erro ao salvar curso.", 'Ok', { duration: 5000 });
  }

  getErrorMessage(fieldName: string) {
    const field: any = this.form.get(fieldName);

    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `O tamanho mínimo precisa ser de ${requiredLength} caracteres.`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `O tamanho máximo precisa ser de ${requiredLength} caracteres.`;
    }


    return 'Campo inválido.';
  }

  isFormArrayRequired() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    return !lessons.valid && lessons.hasError('required') && lessons.touched;
  }

}
