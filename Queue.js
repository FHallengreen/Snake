import {LinkedList} from './LinkedList.js'

export class Queue {
    constructor() {
        this.linkedList = new LinkedList();
    }

    enqueue(payload) {
        this.linkedList.add(payload);
    }

    dequeue() {
        const firstItem = this.linkedList.first();
        this.linkedList.removeFirst();
        return firstItem;
    }

    peek() {
        return this.linkedList.first();
    }

    isEmpty() {
        return this.linkedList.head === null;
    }

    dumpQueue() {
        this.linkedList.dumpList();
    }

    traverse(action) {
        let currentNode = this.linkedList.head;
        while (currentNode !== null) {
          action(currentNode.payload);
          currentNode = currentNode.next;
        }
      }

    
}
