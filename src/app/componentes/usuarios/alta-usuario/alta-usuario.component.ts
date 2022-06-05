import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.scss']
})
export class AltaUsuarioComponent implements OnInit {

  altaUsuario:boolean=true
  constructor() { }

  ngOnInit(): void {
  }

}
