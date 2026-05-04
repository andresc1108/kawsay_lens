/**
 * Estructuras de Datos para Kawsay-Lens
 * Implementación de Queue, Stack, Lista Circular Doble y Lista Doble
 */

import type { FrameData, DiagnosticResult, VisionFilter } from '@/types';

/**
 * QUEUE (Cola): Para gestionar frames de la cámara
 * Estructura FIFO (First In First Out)
 */
export class FrameQueue {
  private queue: FrameData[] = [];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  enqueue(frame: FrameData): void {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // Elimina el más antiguo si alcanza el límite
    }
    this.queue.push(frame);
  }

  dequeue(): FrameData | undefined {
    return this.queue.shift();
  }

  peek(): FrameData | undefined {
    return this.queue[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

/**
 * STACK (Pila): Para almacenar diagnósticos recientes
 * Estructura LIFO (Last In First Out)
 */
export class DiagnosticStack {
  private stack: DiagnosticResult[] = [];

  push(diagnosis: DiagnosticResult): void {
    this.stack.push(diagnosis);
  }

  pop(): DiagnosticResult | undefined {
    return this.stack.pop();
  }

  peek(): DiagnosticResult | undefined {
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }

  getAll(): DiagnosticResult[] {
    return [...this.stack];
  }

  clear(): void {
    this.stack = [];
  }
}

/**
 * Nodo para Lista Doble
 */
class DoublyLinkedNode<T> {
  data: T;
  next: DoublyLinkedNode<T> | null = null;
  prev: DoublyLinkedNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

/**
 * LISTA DOBLE: Para almacenar historial completo de sesión
 */
export class DoublyLinkedList<T> {
  private head: DoublyLinkedNode<T> | null = null;
  private tail: DoublyLinkedNode<T> | null = null;
  private length: number = 0;

  append(data: T): void {
    const newNode = new DoublyLinkedNode(data);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
      }
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(data: T): void {
    const newNode = new DoublyLinkedNode(data);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }

  getAll(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.data);
      current = current.next;
    }

    return result;
  }

  getAllReverse(): T[] {
    const result: T[] = [];
    let current = this.tail;

    while (current) {
      result.push(current.data);
      current = current.prev;
    }

    return result;
  }

  insertAt(data: T, index: number): boolean {
    if (index < 0 || index > this.length) return false;

    if (index === 0) {
      this.prepend(data);
      return true;
    }

    if (index === this.length) {
      this.append(data);
      return true;
    }

    const newNode = new DoublyLinkedNode(data);
    let current = this.head;
    let previous: DoublyLinkedNode<T> | null = null;
    let count = 0;

    while (count < index) {
      previous = current;
      if (current) current = current.next;
      count++;
    }

    if (previous && current) {
      newNode.next = current;
      newNode.prev = previous;
      previous.next = newNode;
      current.prev = newNode;
      this.length++;
      return true;
    }

    return false;
  }

  removeAt(index: number): T | null {
    if (index < 0 || index >= this.length) return null;

    let current = this.head;

    if (index === 0) {
      if (this.head) {
        const data = this.head.data;
        this.head = this.head.next;
        if (this.head) {
          this.head.prev = null;
        } else {
          this.tail = null;
        }
        this.length--;
        return data;
      }
    } else {
      let previous: DoublyLinkedNode<T> | null = null;
      let count = 0;

      while (count < index) {
        previous = current;
        if (current) current = current.next;
        count++;
      }

      if (current && previous) {
        previous.next = current.next;
        if (current.next) {
          current.next.prev = previous;
        } else {
          this.tail = previous;
        }
        this.length--;
        return current.data;
      }
    }

    return null;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}

/**
 * Nodo para Lista Circular Doble
 */
class CircularDoublyLinkedNode<T> {
  data: T;
  next: CircularDoublyLinkedNode<T> | null = null;
  prev: CircularDoublyLinkedNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

/**
 * LISTA CIRCULAR DOBLE: Para selector de Filtros de Visión
 * Permite navegación infinita (circular)
 */
export class CircularDoublyLinkedList<T> {
  private head: CircularDoublyLinkedNode<T> | null = null;
  private current: CircularDoublyLinkedNode<T> | null = null;
  private length: number = 0;

  append(data: T): void {
    const newNode = new CircularDoublyLinkedNode(data);

    if (this.head === null) {
      this.head = newNode;
      this.current = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
    } else {
      const tail = this.head.prev;
      if (tail) {
        tail.next = newNode;
        newNode.prev = tail;
      }
      newNode.next = this.head;
      this.head.prev = newNode;
    }
    this.length++;
  }

  getNext(): T | null {
    if (this.current) {
      this.current = this.current.next;
      return this.current?.data || null;
    }
    return null;
  }

  getPrev(): T | null {
    if (this.current) {
      this.current = this.current.prev;
      return this.current?.data || null;
    }
    return null;
  }

  getCurrent(): T | null {
    return this.current?.data || null;
  }

  getAll(): T[] {
    const result: T[] = [];
    if (this.head === null) return result;

    let node: CircularDoublyLinkedNode<T> | null = this.head;

    for (let i = 0; i < this.length; i++) {
      if (node) {
        result.push(node.data);
        node = node.next;
      }
    }

    return result;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  clear(): void {
    this.head = null;
    this.current = null;
    this.length = 0;
  }
}
