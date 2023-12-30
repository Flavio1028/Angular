import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { CoursePage } from '../../model/course-page';
import { CoursesService } from '../../services/courses.service';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoursesListComponent } from '../../components/courses-list/courses-list.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, NgIf, CoursesListComponent, MatPaginatorModule, MatProgressSpinnerModule, AsyncPipe]
})
export class CoursesComponent implements OnInit {

  courses$: Observable<CoursePage> | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;

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

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }): void {
    this.courses$ = this.service.list(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap((): void => {
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        }),
        catchError(() => {
          this.onError("Erro ao carregar cursos.");
          return of({ courses: [], totalElements: 0, totalPage: 0 })
        })
      );
  }

  onError(message: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: message
    });
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], { relativeTo: this.route })
  }

  onRemove(course: Course) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: "Tem certeza que deseja remover esse curso ? ",
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
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
