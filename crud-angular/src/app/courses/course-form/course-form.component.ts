import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
    ) {

      this.form = this.formBuilder.group({
        name: [null],
        category: [null]
      });

    }

  ngOnInit(): void { }

  onSubmit() {
    console.log("Salvar !!");
  }

  onCancel() {
    this.router.navigate(['courses'])
  }

}
