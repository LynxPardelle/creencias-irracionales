import { Component, OnInit } from '@angular/core';
import { questions } from './shared/utility/questions';
import { NgxBootstrapExpandedFeaturesService } from './shared/services/bef.service';
import { IQuestion } from './shared/interfeces/question';
import * as fileSaver from 'file-saver';
export interface IAnswer {
  index: number;
  question: IQuestion;
  answer: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public questions: IQuestion[] = questions;
  public answers: IAnswer[] = this.questions.map((q, i) => {
    return {
      index: i,
      question: q,
      answer: 0,
    };
  });
  public currentAnswer: number = 0;
  public sections: string[] = [];
  public finished: boolean = false;
  public consola: string = '';
  public importInput: string = '';
  public hasAnswers: boolean = false;
  constructor(private _befService: NgxBootstrapExpandedFeaturesService) {
    this.questions.forEach((q) => {
      if (!this.sections.includes(q.section)) {
        this.sections.push(q.section);
      }
    });
  }

  ngOnInit(): void {
    this.cssCreate();
  }

  getCurrentAnswer(): IAnswer {
    let answer = this.answers.find((a) => a.index === this.currentAnswer);
    while (!answer) {
      if (this.currentAnswer < 0) {
        this.currentAnswer = 0;
      } else {
        this.currentAnswer--;
      }
      answer = this.answers.find((a) => a.index === this.currentAnswer);
    }
    this.cssCreate();
    return answer;
  }

  changeCurrentAnswer(type: '+' | '-' | 'reset') {
    this.currentAnswer =
      type === '+'
        ? this.currentAnswer + 1
        : type === '-'
        ? this.currentAnswer - 1
        : 0;
    if (this.currentAnswer === 0) {
      this.finished = false;
    }
    this.cssCreate();
  }

  answerQuestion(answer: number) {
    this.hasAnswers = true;
    this.getCurrentAnswer().answer = answer;
    if (this.answers[this.currentAnswer + 1]) {
      this.changeCurrentAnswer('+');
    } else {
      this.finalizar();
    }
  }

  finalizar(imported: boolean = false) {
    this.finished = true;
    this.getAnswers(imported);
  }

  getAnswers(imported: boolean = false) {
    this.consola = JSON.stringify(this.answers);
    if (!imported) {
      this.writeText();
    }
  }

  /* TODO: Check this... */
  importAnswers() {
    try {
      if (this.importInput === '') {
        throw new Error('No has escrito nada.');
      }
      let newAnswers = JSON.parse(this.importInput);
      if (!newAnswers || !newAnswers[0]) {
        throw new Error('Lo que has escrito no es válido, por favor revisalo.');
      }
      if (this.answers.length !== newAnswers.length) {
        throw new Error(
          'No hay la misma cantidad de preguntas que en el formato normal, por favor revisalo.'
        );
      }
      for (let nA of newAnswers) {
        if (this.answers[nA.index].question !== nA.question) {
          throw new Error(
            'Una de las preguntas ha sido manipulada, revisa con atención lo que copiaste.'
          );
        }
      }
      this.answers = newAnswers;
      if (!this.checkIfAllEmpty()) {
        this.finalizar(true);
      }
      this.cssCreate();
    } catch (error) {
      this.consola =
        'Hay un error con las respuestas que quieres importar:\n' + error;
    }
  }

  clearAnswers() {
    for (let a of this.answers) {
      a.answer = 0;
    }
    this.hasAnswers = false;
    this.finished = false;
    this.consola = '';
  }
  getPuntuation(section: string): number {
    let puntuation: number = 0;
    puntuation = this.answers
      .map((a: IAnswer) => {
        if (a.question.section === section) {
          return a.answer;
        } else {
          return 0;
        }
      })
      .reduce((sum, a) => sum + a, 0);
    return puntuation;
  }

  checkIfAllEmpty(): boolean {
    return (
      this.answers.filter((a) => {
        return a.answer !== 0;
      }).length <= 0
    );
  }

  handleFileSelect(evt: any) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

    reader.readAsText(f);
    reader.onload = ((f) => {
      return (e: any) => {
        this.importInput = e.target.result;
        this.importAnswers();
      };
    })(f);
  }

  writeText() {
    const str = JSON.stringify(this.answers);
    const FileSaver = fileSaver;
    const blob = new Blob([str], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'CreenciasIrracionales.txt');
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
