[![Build Status](https://travis-ci.org/snst-lab/cellular-automaton-webassembly.svg?branch=master)](https://travis-ci.org/snst-lab/cellular-automaton-webassembly) 

Cellular Automaton using Web Assembly
=============
Cellular automaton which is a famous numerical experiment (Game of Life). I experimented that using Web Assembly with "wasm-bindgen" and "web-sys" crate.
> 

<br>

## Contents

> [Rules](#rules)
>
> [Result](#result)
>
> [Demo](#demo)
>
> [Cargo.toml](#cargo.toml)
>
> [Rust](#rust)
>
> [Javascript](#javascript)  


<br>

## Rules
 - Any live cell with fewer than 2 live neighbours dies, as if by underpopulation.
 - Any live cell with 2 or 3 live neighbours lives on to the next generation.
 - Any live cell with more than 3 live neighbours dies, as if by overpopulation.
 - Any dead cell with exactly 3 live neighbours becomes a live cell, as if by reproduction.


## Result

 Here, n is the number of cells contained in one side

> ### n = 20
[![cell20](https://raw.githubusercontent.com/snst-lab/cellular-automaton-webassembly/master/doc/img/cell20.gif)]()

> ### n = 50
[![cell50](https://raw.githubusercontent.com/snst-lab/cellular-automaton-webassembly/master/doc/img/cell50.gif)]()

> ### n = 100
[![cell100](https://raw.githubusercontent.com/snst-lab/cellular-automaton-webassembly/master/doc/img/cell100.gif)]()

<br>

## Cargo.toml
 I used "lazy_static" crate in order to use the vector holding the state and class name of each cell as a global variable.

```toml
[package]
name = "wasm"
version = "0.1.0"
authors = ["snst.lab <snst.lab@gmail.com>"]
edition = "2018"

[lib]
crate-type = ["cdylib"]

[dependencies]
lazy_static = "0.2.1"

[dependencies.wasm-bindgen]
version = "0.2.45"

[dependencies.web-sys]
version = "0.3.4"
features = [
  'Document',
  'Window',
  'Element',
  'Node',
  'HtmlElement',
  'DocumentFragment',
  'CssStyleDeclaration',
  'Event',
  'EventTarget',
  'MouseEvent',
]
```
<br>

## Demo

[Jump to demo site](https://cellular-automaton-webassembly.herokuapp.com/)

<br>

## Rust 
Here is an excerpt. Web-sys functions such as "create_element", "query_selector", etc. are defined in a different crate.

```rust
extern crate wasm_bindgen;

pub mod web;
use crate::web::{Document,Window};

use std::rc::Rc;
use std::cell::RefCell;
use web_sys::{HtmlElement, DocumentFragment};
use wasm_bindgen::{prelude::*, JsCast};

#[macro_use]
extern crate lazy_static;
use std::sync::RwLock;

lazy_static! {
    static ref CELLS: RwLock<Vec<String>> = RwLock::new(Vec::new());
    static ref LIFE: RwLock<Vec<u16>> = RwLock::new(Vec::new());
    static ref LIFE_TEMP: RwLock<Vec<u16>> = RwLock::new(Vec::new());
    static ref MOUSE_DOWN: RwLock<bool> = RwLock::new(false);
    static ref RUNNING: RwLock<bool> = RwLock::new(false);
}

#[wasm_bindgen]
pub struct CellularAutomaton{
    canvas: HtmlElement,
	pub n: isize,
	pub N: isize,
	pub size_of_cell: f64,
}

#[wasm_bindgen]
impl CellularAutomaton{

    #[wasm_bindgen(constructor)]
    pub fn new() -> CellularAutomaton {
        CellularAutomaton { 
            canvas: Document::query_selector(".canvas"),
            n : 20,
            N : 400,
            size_of_cell:10.0
         }
    }
    
    pub fn start(&mut self) -> Result<(), JsValue>{
        self.N = self.n.pow(2);
        self.size_of_cell = self.canvas.client_width() as f64 /self.n as f64;
        CellularAutomaton::draw_canvas(self).expect("failed to draw canvas");
        CellularAutomaton::initialize(self).expect("failed to initialize");
        Ok(())
    }

    fn draw_canvas(&mut self) -> Result<(), JsValue> {
        self.canvas.style().set_property("height", &(self.canvas.client_width().to_string()+"px"))?;
        let fragment : DocumentFragment = DocumentFragment::new().unwrap();

        let mut life = LIFE.write().unwrap();
        let mut life_temp = LIFE_TEMP.write().unwrap();
        let mut cells = CELLS.write().unwrap();
        
        for i in 0..(self.N as usize){
            let cell:HtmlElement = Document::create_element("div");
            let class_name:String = "cell".to_owned() + &i.to_string();
            cell.set_class_name(&("cell ".to_owned()+&class_name));
            cell.style().set_property("width", &(self.size_of_cell.to_string() + "px"))?;
            cell.style().set_property("height", &(self.size_of_cell.to_string() + "px"))?;
            fragment.append_child(&cell)?;

            (*life).push(0);
            (*life_temp).push(0);
            (*cells).push(".".to_owned() + &class_name);
        }
        self.canvas.append_child(&fragment);
        Ok(())
    }

    fn initialize(&self) -> Result<(), JsValue>{
        let mut life = LIFE.write().unwrap();
        let mut life_temp = LIFE_TEMP.write().unwrap();
        let cells = CELLS.write().unwrap();
        
        for i in 0..(self.N as usize){
            if ((i/(self.n as usize))%2==0 && i % 2 == 0) || ((i/(self.n as usize))%2==1 && i % 2 == 1){
                (*life)[i] = 1;
                (*life_temp)[i] = 1;
                let cell:HtmlElement = Document::query_selector(&(*cells)[i as usize]);
                cell.style().set_property("background-color", "deeppink").expect("failed to set property");
            }
        }
        let mut running = RUNNING.write().unwrap();
        (*running) = true;
        CellularAutomaton::run(self.n,self.N);
        Ok(())
    }

    fn run(n:isize, N:isize) -> Result<(), JsValue>{
        let f = Rc::new(RefCell::new(None));
        let g = f.clone();
        
        let mut frame = 0;
        *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
            let runnning = RUNNING.read().unwrap();
            if *runnning {
                if frame % 15 == 0 {CellularAutomaton::evaluate(n,N).expect("failed to evaluate");}
                frame += 1;
                Window::request_animation_frame(f.borrow().as_ref().unwrap());
            }
        }) as Box<FnMut()>));
        Window::request_animation_frame(g.borrow().as_ref().unwrap());
        Ok(())
    }

    fn evaluate(n:isize, N:isize) -> Result<(), JsValue>{
        let cells = CELLS.read().unwrap();
        let mut life = LIFE.write().unwrap();
        let mut life_temp = LIFE_TEMP.write().unwrap();

        for i in 0..N {
			let top_right: isize = i - n + 1;
			let top: isize = i - n;
			let top_left: isize = i - n - 1;
			let left: isize = i - 1;
			let bottom_left: isize = i + n - 1;
			let bottom: isize = i + n;
			let bottom_right: isize = i + n + 1;
			let right: isize = i + 1;

            let around : u16 =
				(if top_right < 0 { 0 } else { (*life)[top_right as usize] } ) +
				(if top < 0 { 0 } else { (*life)[top as usize] } ) +
				(if top_left < 0 { 0 } else { (*life)[top_left as usize] } ) +
				(if left < 0 { 0 } else { (*life)[left as usize] } ) +
				(if bottom_left >= N  { 0 } else { (*life)[bottom_left as usize] } ) +
				(if bottom >= N  { 0 } else { (*life)[bottom as usize] } ) +
				(if bottom_right >= N { 0 } else { (*life)[bottom_right as usize] } ) +
				(if right >= N  { 0 } else { (*life)[right as usize] } );

            (*life_temp)[i as usize] = (*life)[i as usize]; 

			if (*life)[i as usize] == 0 && around == 3 {
                let cell:HtmlElement = Document::query_selector(&(*cells)[i as usize]);
                cell.style().set_property("background-color", "deeppink").expect("failed to set property");
				(*life_temp)[i as usize] = 1;

			} else if (*life)[i as usize] == 1 && (around == 2 || around == 3) {
				continue;

			} else if (*life)[i as usize] == 1 && (around <= 1 || around >= 4) {
                let cell:HtmlElement = Document::query_selector(&(*cells)[i as usize]);
                cell.style().set_property("background-color", "lightgray").expect("failed to set property");
				(*life_temp)[i as usize] = 0;
			}
        }
        for i in 0..(N as usize){
		    (*life)[i] = (*life_temp)[i]; 
        }
        Ok(())
    }
}

```


---

<br>

## JavaScript
Using TypeScript for transpiler.
Because initialization of WebAssembly requires asynchronous reading, I wrapped the initialization function with an async immediate function.

```ts
import { CellularAutomaton as CA , default as init } from '../wasm/pkg/wasm.js';

(async() =>{
    await init('./src/wasm/pkg/wasm_bg.wasm');
    const ca: CA = new CA();
    ca.start();

})().catch(() => 'Failed to load wasm.');

```


## Author
[TANUSUKE](https://pragma-curry.com/)  