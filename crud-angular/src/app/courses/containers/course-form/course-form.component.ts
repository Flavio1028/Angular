import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form = this.formBuilder.group({
    name: [''],
    category: ['']
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private service: CoursesService,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {}

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
    this._snackBar.open("Curso salvo com sucesso.", '',{ duration: 5000});
    this.router.navigate(['courses']);
  }

  private onError() {
    this._snackBar.open("Erro ao salvar curso.", 'Ok',{ duration: 5000});
  }

}
