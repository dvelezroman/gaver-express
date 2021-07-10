const dialogExample = {
  q1: {
    text: "Hola ${ClientName}, queremos conocer tu opinion, sobre los servicios recibidos el ${ServiceDate}",
    type: "si/no",
    status: false,
    response: null,
    flow: {
      1: {
        text: "En una escala del 1 al 10, con que número calificaría el servicio recibido?",
        type: "number",
        status: false,
        response: null,
        flow: null
      },
      2: {
        text: "Recomendaría nuestros servicios a otra persona?",
        type: "number",
        status: false,
        response: null,
        flow: null
      },
      3: {
        text: "Desea agregar algún comentario adicional?",
        type: "text",
        status: false,
        response: null,
        flow: null
      },
      final: "Gracias ${ClientName}, su opinión nos ayuda a mejorar para brindarte un mejor servicio."
    }
  },
  q2: {
    text: "Hola ${ClientName}, deseas realizar una consulta?",
    type: 'si/no',
    status: false,
    response: null,
    flow: null
  },
  q3: {
    text: "Hola ${ClientName}, queremos conocer tu opinión",
    type: "si/no",
    status: false,
    response: null,
    flow: null
  }
}

module.exports = {
  dialogExample
}
