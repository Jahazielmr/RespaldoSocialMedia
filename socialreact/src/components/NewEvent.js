import React, { Component } from 'react';
import * as firebase from 'firebase';
import './Home.css';
import * as routes from '../constants/routes';
import $ from 'jquery';
/*import {withRouter}  from 'react-router-dom';*/
/*import Home from './Home';*/

const NewEvent = (/*{history}*/) =>
    <div id="event">
        <div id="main-title">Nuevo Mensaje</div>
        <NewEventForm /*history={history}*/ />
    </div>

const INITIAL_STATE = {
    eventname: '',
    username: '',
    locationname: '',
    tipo: '',
    userid: '',
    error: null,
}

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class NewEventForm extends Component {
    constructor(props) {
        super(props);
        this.state = { INITIAL_STATE };

        this.addMessage = this.addMessage.bind(this);
    }

    addMessage() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                if (this.state.tipo == "Privado") {
                    var eventRef = firebase.database().ref().child("Mensajes Privados");
                    var userRef = firebase.database().ref().child("Usuarios");
                    var key = eventRef.push().getKey();

                    var user = firebase.auth().currentUser;
                    var id = user.uid;
                    var userRef = firebase.database().ref().child("Usuarios").child(id);
                    var nameaux;

                    userRef.on("value", function (snapshot) {
                        nameaux = snapshot.child("Nombre").val();
                    })

                    eventRef.child(key).set({
                        "Nombre": this.state.eventname,
                        "username": nameaux,
                        "Lugar": this.state.locationname,
                        "Tipo": this.state.tipo,
                        "userid": id,
                        "Llave": key,
                    });

                } else if (this.state.tipo == "Publico") {
                    var eventRef = firebase.database().ref().child("Mensajes Publico");
                    var userRef = firebase.database().ref().child("Usuarios");
                    var key = eventRef.push().getKey();
                    var user = firebase.auth().currentUser;
                    var id = user.uid;
                    var userRef = firebase.database().ref().child("Usuarios").child(id);
                    var nameaux;

                    userRef.on("value", function (snapshot) {
                        nameaux = snapshot.child("Nombre").val();
                    })

                    eventRef.child(key).set({
                        "Nombre": this.state.eventname,
                        "username": nameaux,
                        "Lugar": this.state.locationname,
                        "Tipo": this.state.tipo,
                        "userid": id,
                        "Llave": key,
                    });
                }

            } else {

            }
        });


    }

    onClick = (event) => {
        const {
            eventname,
            username,
            locationname,
            tipo,
            userid,
            error,
        } = this.state;
        const {
            history,
        } = this.props;

        { this.addMessage() }

        event.preventDefault();
        /*history.push(routes.HOME);*/
    }


    render() {
        const {
            eventname,
            locationname,
            tipo,
            error,
        } = this.state;

        const isInvalid =
            eventname === '' ||
            locationname === '' ||
            tipo === '';


        return (
            <div onSubmit={this.onSubmit}>
                <form id="input-list" className="uk-grid-small">
                    <div id="input-list-item">
                        <input id="new-event-input"
                            className="uk-input"
                            value={eventname}
                            onChange={event => this.setState(byPropKey('eventname', event.target.value))}
                            type="text"
                            placeholder="Titulo"
                        />
                    </div>
                    <div id="input-list-item">
                        <input id="new-event-input"
                            className="uk-input"
                            value={locationname}
                            onChange={event => this.setState(byPropKey('locationname', event.target.value))}
                            type="text"
                            placeholder="Contenido"
                        />
                    </div>
                    <div id="input-list-item">
                        <input id="new-event-input"
                            className="uk-input"
                            value={tipo}
                            onChange={event => this.setState(byPropKey('tipo', event.target.value))}
                            type="text"
                            placeholder="Publico o Privado"
                        />
                    </div>

                </form>
                <button id="bt-signup" className="w3-button w3-round-xxlarge" disabled={isInvalid} onClick={this.onClick}>
                    Publicar        </button>

                {error && <p>{error.message}</p>}
            </div>
        );
    }
}

export default NewEvent;