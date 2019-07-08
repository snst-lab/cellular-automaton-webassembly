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
        CellularAutomaton::attach_canvas_event(self).expect("failed to attach canvas event");
        CellularAutomaton::attach_button_event(self).expect("failed to attach button event");
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

    fn attach_canvas_event(&mut self) -> Result<(), JsValue>{
        {
            let closure = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
                event.prevent_default();
                let mut mouse_down = MOUSE_DOWN.write().unwrap();
                *mouse_down = true;
            }) as Box<dyn FnMut(_)>);
            self.canvas.add_event_listener_with_callback("mousedown", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let closure = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
                event.prevent_default();
                let mut mouse_down = MOUSE_DOWN.write().unwrap();
                *mouse_down = false;
            }) as Box<dyn FnMut(_)>);
            self.canvas.add_event_listener_with_callback("mouseup", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let cells = CELLS.read().unwrap();
            for i in 0..(self.N as usize){
                let cell:HtmlElement = Document::query_selector(&(*cells)[i]);
                let closure = Closure::wrap(Box::new(move |_event: web_sys::MouseEvent| {
                    let mouse_down = MOUSE_DOWN.read().unwrap();
                    if *mouse_down {
                        let mut life = LIFE.write().unwrap();
                        (*life)[i] = 1;
                        cell.style().set_property("background-color", "deeppink").expect("failed to set property");
                    }
                }) as Box<dyn FnMut(_)>);
                let cell:HtmlElement = Document::query_selector(&(*cells)[i]);
                cell.add_event_listener_with_callback("mouseover", closure.as_ref().unchecked_ref())?;
                closure.forget();
            }
        }
        Ok(())
    }

    fn attach_button_event(&mut self) -> Result<(), JsValue>{
        let n:isize = self.n;
        let N:isize = self.N;
        {
            let btn:HtmlElement = Document::query_selector(&".btn-run");
            let closure = Closure::wrap(Box::new(move |_event: web_sys::MouseEvent| {
                let mut running = RUNNING.write().unwrap();
                (*running) = true;
                CellularAutomaton::run(n,N).expect("failed to run");
                
            }) as Box<dyn FnMut(_)>);
            btn.add_event_listener_with_callback("click", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let btn:HtmlElement = Document::query_selector(&".btn-clear");
            let cells = CELLS.read().unwrap();
            
            let closure = Closure::wrap(Box::new(move |_event: web_sys::MouseEvent| {
                let mut life = LIFE.write().unwrap();
                for i in 0..(N as usize){
                    let cell:HtmlElement = Document::query_selector(&(*cells)[i]);
                    cell.style().set_property("background-color", "lightgray").expect("failed to set property");
                    (*life)[i] = 0;
		    	}
            }) as Box<dyn FnMut(_)>);
            btn.add_event_listener_with_callback("click", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
        {
            let btn:HtmlElement = Document::query_selector(&".btn-pause");
            let closure = Closure::wrap(Box::new(move |_event: web_sys::MouseEvent| {
                let mut running = RUNNING.write().unwrap();
                (*running) = false;
                
            }) as Box<dyn FnMut(_)>);
            btn.add_event_listener_with_callback("click", closure.as_ref().unchecked_ref())?;
            closure.forget();
        }
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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn log_u32(a: u32);
}
