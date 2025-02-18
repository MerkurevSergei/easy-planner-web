import React, { Component } from 'react';
export default function Hi() {
    class Field extends Component {
        render() {
            return <h2>Hello, world</h2>;
        }
    }

    return <Field></Field>;
}