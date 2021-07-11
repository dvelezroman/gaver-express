const dialogExample = {
  q1: {
    id: "q1",
    text: "Hola, queremos conocer tu opinion, sobre los servicios recibidos.",
    type: "si/no",
    status: false,
    response: null,
    flow: {
      1: {
        id: 1,
        text: "En una escala del 1 al 10, con que número calificaría el servicio recibido?",
        type: "number",
        status: "pendant", // "pendant", "completed"
        response: null,
        flow: null,
        isLast: false
      },
      2: {
        id: 2,
        text: "Recomendaría nuestros servicios a otra persona?",
        type: "boolean",
        status: "pendant",
        response: null,
        flow: null,
        isLast: false
      },
      3: {
        id: 3,
        text: "Desea agregar algún comentario adicional?",
        type: "string",
        status: "pendant",
        response: null,
        flow: null,
        isLast: false
      },
      final: {
        text: "Gracias, su opinión nos ayuda a mejorar para brindarte un mejor servicio.",
        status: "pendant",
        isLast: true
      }
    }
  },
  q2: {
    id: "q2",
    text: "Hola ${ClientName}, deseas realizar una consulta?",
    type: 'si/no',
    status: false,
    response: null,
    flow: null
  },
  q3: {
    id: "q3",
    text: "Hola ${ClientName}, queremos conocer tu opinión",
    type: "si/no",
    status: false,
    response: null,
    flow: null
  }
}

module.exports = dialogExample
