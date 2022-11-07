import { read } from "../utils/FS.js";
import keyboardsText from "./keyboards-text.js";


const allMeals = read('meals.json')
let meals = []
for(let i=0; i<allMeals.length; i+=2) {
    let arr =[]
    arr.push(allMeals[i].name, allMeals[i+1]? allMeals[i+1].name:null)
    meals.push(arr.filter(e=>e));
}
    meals.push([keyboardsText.mainMenu])
export default {
    menu: [
        [keyboardsText.ourMeals, keyboardsText.ourAdress],
        [keyboardsText.aboutUs]

    ],
    meals
}