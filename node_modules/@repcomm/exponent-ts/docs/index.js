import { Panel, Text, Button, EXPONENT_CSS_STYLES } from "./mod.js"; //function we can await promises in

async function main() {
  //add exponent styles (aka the sensible defaults based on flex and grid)
  EXPONENT_CSS_STYLES.mount(document.head); //create a container for all the elements for convenience
  //(incase sharing the page with another UI framework, for instance)

  const container = new Panel().setId("container").mount(document.body); //attach to body

  const title = new Text().setTextContent("Welcome to my site").mount(container); //attach to container
  //create a little utility for making random css rgb colors

  const random = {
    byte: () => Math.floor(Math.random() * 255),
    rgb: () => `rgb(${random.byte()},${random.byte()},${random.byte()})`
  }; //create 10 buttons

  for (let i = 0; i < 10; i++) {
    const button = new Button().setTextContent(`Button ${i}`).on("click", evt => {
      //change color when clicked
      button.setStyleItem("background-color", random.rgb());
    }).mount(container); //attach to container
  }
} //call main (asynchronously)


main();