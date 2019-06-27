import moment from "moment";

export const datePickerFormatToParseDate = (datepickerFormat) => {
    return moment(new Date(datepickerFormat._d)).format("YYYY-MM-DD")
}