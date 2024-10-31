const indexArray = ["elem1", "elem2", "", "elem4", "", "", "void", "", "", "", "something"];


function cut(array) {
  let res = [];
  if (typeof array !== "object" || array === undefined) res = " Error: array param is missing or isn't in correct format";  
  //-----------------------------------------------------------------------------------------------------

  let reverse = array.reverse();

  let endPos;
  reverse.map(string => {
    if (typeof endPos !== "number" && string !== "") endPos = reverse.indexOf(string);
    if (typeof endPos === "number") {
      res.push(string);
    }
  });
  return `\`\`\`\n${res.reverse()}\`\`\``;
}


console.log(`${cut(indexArray)}`.replace(/,/g, "\n"))





/*
class Text {
  format(array, format) {
    array = array.reverse();
    let res = [];
    if (typeof format !== "string" || format === undefined) res = " Error: format param is missing or isn't in correct format";
    else if (typeof array !== "object" || array === undefined) res = " Error: array param is missing or isn't in correct format";  
    else {
      if (res === undefined) res = format;
      array.map(string => {
        if ()
      })
      for (let pos = 0; pos < array.length; pos++) {
        console.log(pos, array[pos]);
        if (array[pos] !== "" && array[pos+1] === "") res.push(pos)
        else if (array[pos] !== "" && pos === array.length-1) res.push(pos)
      }
    }
    return res;
  }
}
console.log(new Text("```").format(indexArray, "```"));
//console.log(indexArray);
*/