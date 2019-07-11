
const __exports = {};
let wasm;

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(exnptr, e) {
    const view = getUint32Memory();
    view[exnptr / 4] = 1;
    view[exnptr / 4 + 1] = addHeapObject(e);
}

function __widl_f_set_property_CSSStyleDeclaration(arg0, arg1, arg2, arg3, arg4, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    let varg3 = getStringFromWasm(arg3, arg4);
    try {
        getObject(arg0).setProperty(varg1, varg3);
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_set_property_CSSStyleDeclaration = __widl_f_set_property_CSSStyleDeclaration

function __widl_f_create_element_Document(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        return addHeapObject(getObject(arg0).createElement(varg1));
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_create_element_Document = __widl_f_create_element_Document

function isLikeNone(x) {
    return x === undefined || x === null;
}

function __widl_f_query_selector_Document(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {

        const val = getObject(arg0).querySelector(varg1);
        return isLikeNone(val) ? 0 : addHeapObject(val);

    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_query_selector_Document = __widl_f_query_selector_Document

function __widl_f_new_DocumentFragment(exnptr) {
    try {
        return addHeapObject(new DocumentFragment());
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_new_DocumentFragment = __widl_f_new_DocumentFragment

function __widl_f_set_class_name_Element(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);
    getObject(arg0).className = varg1;
}
__exports.__widl_f_set_class_name_Element = __widl_f_set_class_name_Element

function __widl_f_client_width_Element(arg0) {
    return getObject(arg0).clientWidth;
}
__exports.__widl_f_client_width_Element = __widl_f_client_width_Element

function __widl_f_prevent_default_Event(arg0) {
    getObject(arg0).preventDefault();
}
__exports.__widl_f_prevent_default_Event = __widl_f_prevent_default_Event

function __widl_f_add_event_listener_with_callback_EventTarget(arg0, arg1, arg2, arg3, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        getObject(arg0).addEventListener(varg1, getObject(arg3));
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_add_event_listener_with_callback_EventTarget = __widl_f_add_event_listener_with_callback_EventTarget

function __widl_instanceof_HTMLElement(idx) { return getObject(idx) instanceof HTMLElement ? 1 : 0; }
__exports.__widl_instanceof_HTMLElement = __widl_instanceof_HTMLElement

function __widl_f_style_HTMLElement(arg0) {
    return addHeapObject(getObject(arg0).style);
}
__exports.__widl_f_style_HTMLElement = __widl_f_style_HTMLElement

function __widl_f_append_child_Node(arg0, arg1, exnptr) {
    try {
        return addHeapObject(getObject(arg0).appendChild(getObject(arg1)));
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_append_child_Node = __widl_f_append_child_Node

function __widl_instanceof_Window(idx) { return getObject(idx) instanceof Window ? 1 : 0; }
__exports.__widl_instanceof_Window = __widl_instanceof_Window

function __widl_f_request_animation_frame_Window(arg0, arg1, exnptr) {
    try {
        return getObject(arg0).requestAnimationFrame(getObject(arg1));
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_request_animation_frame_Window = __widl_f_request_animation_frame_Window

function __widl_f_document_Window(arg0) {

    const val = getObject(arg0).document;
    return isLikeNone(val) ? 0 : addHeapObject(val);

}
__exports.__widl_f_document_Window = __widl_f_document_Window

function __wbg_newnoargs_a172f39151049128(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(new Function(varg0));
}
__exports.__wbg_newnoargs_a172f39151049128 = __wbg_newnoargs_a172f39151049128

function __wbg_call_8a9c8b0a32a202ff(arg0, arg1, exnptr) {
    try {
        return addHeapObject(getObject(arg0).call(getObject(arg1)));
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__wbg_call_8a9c8b0a32a202ff = __wbg_call_8a9c8b0a32a202ff

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

let passStringToWasm;
if (typeof cachedTextEncoder.encodeInto === 'function') {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            arg = arg.slice(offset);
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + arg.length * 3);
            const view = getUint8Memory().subarray(ptr + offset, ptr + size);
            const ret = cachedTextEncoder.encodeInto(arg, view);

            offset += ret.written;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
} else {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            const buf = cachedTextEncoder.encode(arg.slice(offset));
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + buf.length);
            getUint8Memory().set(buf, ptr + offset);
            offset += buf.length;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
}

function __wbindgen_debug_string(i, len_ptr) {
    const debug_str =
    val => {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debug_str(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debug_str(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
        return `${val.name}: ${val.message}
        ${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
;
const toString = Object.prototype.toString;
const val = getObject(i);
const debug = debug_str(val);
const ptr = passStringToWasm(debug);
getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
return ptr;
}
__exports.__wbindgen_debug_string = __wbindgen_debug_string

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function __wbindgen_cb_drop(i) {
    const obj = takeObject(i).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return 1;
    }
    return 0;
}
__exports.__wbindgen_cb_drop = __wbindgen_cb_drop

const __wbindgen_cb_forget = dropObject;
__exports.__wbindgen_cb_forget = __wbindgen_cb_forget;

function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}
__exports.__wbindgen_throw = __wbindgen_throw

function __wbindgen_closure_wrapper85(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(38);
    const d = wasm.__wbg_function_table.get(39);
    const cb = function(arg0) {
        this.cnt++;
        let a = this.a;
        this.a = 0;
        try {
            return f(a, b, addHeapObject(arg0));

        } finally {
            if (--this.cnt === 0) d(a, b);
            else this.a = a;

        }

    };
    cb.a = a;
    cb.cnt = 1;
    let real = cb.bind(cb);
    real.original = cb;
    return addHeapObject(real);
}
__exports.__wbindgen_closure_wrapper85 = __wbindgen_closure_wrapper85

function __wbindgen_closure_wrapper87(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(42);
    const d = wasm.__wbg_function_table.get(39);
    const cb = function() {
        this.cnt++;
        let a = this.a;
        this.a = 0;
        try {
            return f(a, b);

        } finally {
            if (--this.cnt === 0) d(a, b);
            else this.a = a;

        }

    };
    cb.a = a;
    cb.cnt = 1;
    let real = cb.bind(cb);
    real.original = cb;
    return addHeapObject(real);
}
__exports.__wbindgen_closure_wrapper87 = __wbindgen_closure_wrapper87

function freeCellularAutomaton(ptr) {

    wasm.__wbg_cellularautomaton_free(ptr);
}
/**
*/
export class CellularAutomaton {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeCellularAutomaton(ptr);
    }

    /**
    * @returns {number}
    */
    get n() {
        return wasm.__wbg_get_cellularautomaton_n(this.ptr);
    }
    set n(arg0) {
        return wasm.__wbg_set_cellularautomaton_n(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get N() {
        return wasm.__wbg_get_cellularautomaton_N(this.ptr);
    }
    set N(arg0) {
        return wasm.__wbg_set_cellularautomaton_N(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get size_of_cell() {
        return wasm.__wbg_get_cellularautomaton_size_of_cell(this.ptr);
    }
    set size_of_cell(arg0) {
        return wasm.__wbg_set_cellularautomaton_size_of_cell(this.ptr, arg0);
    }
    /**
    * @returns {}
    */
    constructor() {
        this.ptr = wasm.cellularautomaton_new();
    }
    /**
    * @returns {void}
    */
    start() {
        return wasm.cellularautomaton_start(this.ptr);
    }
}

function __wbindgen_object_clone_ref(idx) {
    return addHeapObject(getObject(idx));
}
__exports.__wbindgen_object_clone_ref = __wbindgen_object_clone_ref

function __wbindgen_object_drop_ref(i) { dropObject(i); }
__exports.__wbindgen_object_drop_ref = __wbindgen_object_drop_ref

function init(module) {
    let result;
    const imports = { './wasm': __exports };

    if (module instanceof URL || typeof module === 'string' || module instanceof Request) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                console.warn("`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                return response
                .then(r => r.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    });
}

export default init;

