export function init() {
  sayHello();
}

function sayHello() {
  const hello = document.getElementById("hello") as HTMLParagraphElement;
  hello.innerText = "Hello, js13k!";
}
