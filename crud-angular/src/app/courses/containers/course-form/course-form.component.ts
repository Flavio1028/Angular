import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { CoursesService } from '../../services/courses.service';
import { Course } from './../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form = this.formBuilder.group({
    _id: [''],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    category: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private service: CoursesService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category
    })
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe(
      (_: any) => this.onSuccess(),
      (_: any) => this.onError()
    );
  }

  onCancel() {
    this.router.navigate(['courses'])
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

    if(field?.hasError('required')) {
      return 'Campo obrigatóirio';
    }

    if(field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `O tamanho mínimo precisa ser de ${requiredLength} caracteres.`;
    }

    if(field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `O tamanho máximo precisa ser de ${requiredLength} caracteres.`;
    }


    return 'Campo inválido.';
  }

}
