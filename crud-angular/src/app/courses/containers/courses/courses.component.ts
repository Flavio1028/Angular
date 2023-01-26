import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]> | undefined;

  constructor(
    private service: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.refresh();
   }

  refresh(): void {
    this.courses$ = this.service.list()
      .pipe(
        catchError(() => {
          this.onError("Erro ao carregar cursos.");
          return of([])
        })
      );
  }

  onError(message: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: message
    });
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route});
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], { relativeTo: this.route})
  }

  onRemove(course: Course) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: "Tem certeza que deseja remover esse curso ? ",
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result) {
        this.service.remove(course._id).subscribe({
          next: () => {
            this._snackBar.open("Curso removido com sucesso!", 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.refresh();
          },
          error: () => this.onError('Erro ao tentar remover curso!')
        });
      }
    });
  }

}
