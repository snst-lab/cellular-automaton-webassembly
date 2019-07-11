const color: { [key: string]: string } = {
    'death': 'lightgray',
    'live': 'deeppink'
};
/**
 * ### Cellular Automaton
 *   Famous cellular automaton problem (Game of Life) using Web Assembly with wasm-bindgen and web-sys
 */
export class CellularAutomaton {
    private canvas: HTMLElement;
    private cells: HTMLElement[];
    private life: number[];
    private life_temp: number[];
    private n: number;
    private N: number;
    private size_of_cell: number;
    private mouse_down: boolean;
    private running: boolean;

    constructor() {
        this.canvas = document.querySelector('.canvas') as HTMLElement;
        this.cells = [];
        this.life = [];
        this.life_temp = [];
        this.n = 20;
        this.N = this.n ** 2;
        this.size_of_cell = this.canvas.clientWidth / this.n;
    }

    public start(): void {
        this.drawCanvas();
        this.initialize();
        this.attachCanvasEvent();
        this.attachButtonEvent();
    }

    public drawCanvas(): void {
        this.canvas.style.height = this.canvas.clientWidth as unknown as string + 'px';

        const fragment: DocumentFragment = document.createDocumentFragment();
        for (let i: number = 0; i < this.N; i++) {
            const cell: HTMLElement = document.createElement('div');
            cell.className = 'cell cell' + (i as unknown as string);
            cell.style.width = this.size_of_cell as unknown as string + 'px';
            cell.style.height = this.size_of_cell as unknown as string + 'px';
            this.cells.push(cell);
            this.life.push(0);
            this.life_temp.push(0);
            fragment.appendChild(cell);
        }
        this.canvas.appendChild(fragment);
    }

    public initialize(): void {
        for (let i: number = 0; i < this.N; i++) {
            if ((~~(i / this.n) % 2 === 0 && i % 2 === 0) || (~~(i / this.n) % 2 === 1 && i % 2 === 1)) {
                this.life[i] = 1;
                this.life_temp[i] = 1;
                this.cells[i].style.backgroundColor = color.live;
            }
        }
        this.running = true;
        this.run(0);
    }

    public attachCanvasEvent(): void {
        this.canvas.addEventListener('mousedown', (event: PointerEvent) => {
            event.preventDefault();
            this.mouse_down = true;
        });
        this.canvas.addEventListener('mouseup', (event: PointerEvent) => {
            event.preventDefault();
            this.mouse_down = false;
        });
        for (let i: number = 0; i < this.N; i++) {
            this.cells[i].addEventListener('mouseover', (event: PointerEvent) => {
                event.preventDefault();
                if (this.mouse_down) {
                    this.cells[i].style.backgroundColor = color.live;
                    this.life[i] = 1;
                    this.life_temp[i] = 1;
                }
            });
        }
    }

    public attachButtonEvent(): void {
        (document.querySelector('.btn-run') as HTMLElement).addEventListener('click', () => {
            this.running = true;
            this.run(0);
        });
        (document.querySelector('.btn-clear') as HTMLElement).addEventListener('click', () => {
            for (let i: number = 0; i < this.N; i++) {
                this.cells[i].style.backgroundColor = color.death;
                this.life[i] = 0;
            }
        });
        (document.querySelector('.btn-pause') as HTMLElement).addEventListener('click', () => {
            this.running = false;
        });
    }

    public run(frame: number): void {
        window.requestAnimationFrame(() => {
            if (this.running) {
                if (frame % 15 === 0) this.evaluate();
                this.run(frame + 1);
            }
        });
    }

    public evaluate(): void {
        for (let i: number = 0; i < this.N; i++) {
            const top_right: number = i - this.n + 1;
            const top: number = i - this.n;
            const top_left: number = i - this.n - 1;
            const left: number = i - 1;
            const bottom_left: number = i + this.n - 1;
            const bottom: number = i + this.n;
            const bottom_right: number = i + this.n + 1;
            const right: number = i + 1;

            const around: number =
                (top_right < 0 ? 0 : this.life[top_right]) +
                (top < 0 ? 0 : this.life[top]) +
                (top_left < 0 ? 0 : this.life[top_left]) +
                (left < 0 ? 0 : this.life[left]) +
                (bottom_left >= this.N ? 0 : this.life[bottom_left]) +
                (bottom >= this.N ? 0 : this.life[bottom]) +
                (bottom_right >= this.N ? 0 : this.life[bottom_right]) +
                (right >= this.N ? 0 : this.life[right]);

            if (this.life[i] === 0 && around === 3) {
                this.cells[i].style.backgroundColor = color.live;
                this.life_temp[i] = 1;
            } else if (this.life[i] === 1 && (around === 2 || around === 3)) {
                continue;
            } else if (this.life[i] === 1 && (around <= 1 || around >= 4)) {
                this.cells[i].style.backgroundColor = color.death;
                this.life_temp[i] = 0;
            }
        }
        for (let i: number = 0; i < this.N; i++) {
            this.life[i] = this.life_temp[i];
        }
    }
}
