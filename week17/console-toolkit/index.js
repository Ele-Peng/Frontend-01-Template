var tty = require('tty');
var ttys = require('ttys');
var rl = require('readline');




var stdin = ttys.stdin;
var stdout = ttys.stdout;


// // stdout.write("hello world\n");
// // stdout.write("\033[1A"); // Move the cursor up N lines: \033[<N>A
// // stdout.write("elle\n");

// const readline = require('readline');
// const { resolve } = require('path');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// async function ask(question) {
//     return new Promise((resolve, reject) => {

//         rl.question(question, (answer) => {
//           // TODO: Log the answer in a database
//           resolve(answer);
//         });
//     })
// }

// void async function () {
//     console.log( await ask("what is your project name?")); 
// }();


// var ttys = require('ttys');

// var stdin = ttys.stdin;
// var stdout = ttys.stdout;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding("utf-8");


// stdin.on("data", function(key) {
//     stdout.write( key.toString().charCodeAt(0).toString() );
//     if (key == "\u0003") process.exit(); 

// });


function getChar() {
    return new Promise((resolve) => {
        stdin.on("data", function(key) {
            resolve(key);
        });
    })
}

function up(n = 1) {
    stdout.write("\033[" + n + "A"); // Move the cursor up N lines: \033[<N>A
}

function down(n = 1) {
    stdout.write("\033[" + n + "B"); // Move the cursor up N lines: \033[<N>A
}

function right(n = 1) {
    stdout.write("\033[" + n + "C"); // Move the cursor up N lines: \033[<N>A
}

function left(n = 1) {
    stdout.write("\033[" + n + "D"); // Move the cursor up N lines: \033[<N>A
}

// void async function () {
//     while(true) {
//         let char = await getChar();
//         if (char === "\u0003") {
//             process.exit();
//             break;
//         }
//         console.log(char.split("").map(c => c.charCodeAt(0)))
//         // stdout.write( char.split("").map(c => c.charCodeAt(0)) );
//     }
// }();


async function select(choices) {
    
	let selected = 0;
	for (let i = 0; i < choices.length; i++) {
		if (i === selected) {
			stdout.write("[x] " + choices[i] + "\n");
		} else {
			stdout.write("[ ] " + choices[i] + "\n");
		}
	}
	up(choices.length);
	right();

	while (true) {
		let char = await getChar();
		if (char === "\u0003") {
			process.exit();
		}
        // w s a d control
		if (char === "w" && selected > 0) {
			stdout.write(" ");
			left();
			selected--;
			up();
			stdout.write("x");
			left();
		}
		if (char === "s" && selected < choices.length - 1) {
			stdout.write(" ");
			left();
			selected++;
			down();
			stdout.write("x");
			left();
		}
		if (char === "\r") {
			down(choices.length - selected);
			left();
			return choices[selected];
		}
    }
    
}

void (async function () {
	stdout.write("Which framework do you want to use?\n");
	let answer = await select(["react", "vue", "angular"]);
	stdout.write("You selected " + answer + ".\n");
	process.exit();
})();