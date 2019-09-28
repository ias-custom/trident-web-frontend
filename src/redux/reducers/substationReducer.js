import { GET_SUBSTATIONS, DELETE_SUBSTATION } from "../actionTypes";

const initialState = {
  list: [
    {
      id: 1,
      name: "Name substation",
      number: "CDFDHD",
      customer_name: "Luigui Saenz",
      latitude: "1.23343434",
      longitude: "76.4548567"
    },
    {
      id: 2,
      name: "Name substation",
      customer_name: "Luigui Saenz",
      number: "CDFDHD",
      latitude: "1.23343434",
      longitude: "76.4548567"
    },
    {
      id: 3,
      name: "Name substation",
      customer_name: "Luigui Saenz",
      number: "CDFDHD",
      latitude: "1.23343434",
      longitude: "76.4548567"
    }
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSTATIONS:
      return {
        ...state,
        list: action.payload,
        errors: []
      };

    case DELETE_SUBSTATION:
      const list = state.list.filter(({ id }) => id !== action.payload);
      return {
        ...state,
        list: list,
        errors: []
      };

    default:
      return state;
  }
};
