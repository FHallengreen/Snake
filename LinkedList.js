class Node {
	constructor(payload) {
		this.payload = payload;
		this.prev = null;
		this.next = null;
	}
}

export class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

	add(payload) {
		const newNode = new Node(payload);
		if (this.tail) {
			this.tail.next = newNode;
			newNode.prev = this.tail
			this.tail = newNode;
		}
		else {
			this.head = newNode;
			this.tail = newNode;
		}
	}

	addFirst(payload) {
		const newNode = new Node(payload);
		if (this.head) {
			this.head.prev = newNode;
			newNode.next = this.head;
			this.head = newNode;
		} else {
			this.head = newNode;
			this.tail = newNode;
		}
	}

	removeLast() {
		if (this.tail !== null) {

			if (this.tail == this.head) {
				this.head = null;
				this.tail = null;
			}
			else {

				this.tail = this.tail.prev;
				this.tail.next = null;
			}
		}
	}

	removeFirst() {
		if (this.head !== null) {

			if (this.head === this.tail) {
				this.head = null;
				this.tail = null;
			}
			else {
				this.head = this.head.next;
				this.head.prev = null;
			}
		}
	}

	removeNode(node) {
		if (node === null) return;

		if (node === this.head) {
			this.removeFirst();
		} else if (node === this.tail) {
			this.removeLast();
		} else {
			node.prev.next = node.next;
			node.next.prev = node.prev;
			node.prev = null;
			node.next = null;
		}
	}

	insertBeforeNode(payload, existingNode) {
		if (this.head === null) {
			return;
		}
		if (existingNode === this.head) {
			this.addFirst(payload);
			return;
		}

		let current = this.head;

		while (current != null) {
			if (current === existingNode) {
				const newNode = new Node(payload);
				newNode.prev = current.prev;
				newNode.next = current;

				if (current.prev) {
					current.prev.next = newNode;
				}
				current.prev = newNode;
				return;
			}
			current = current.next;
		}
	}

	insertAfterNode(payload, existingNode) {
		if (this.head === null) {
			return;
		}
		if (existingNode === this.tail) {
			this.add(payload);
			return;
		}

		let current = this.head;

		while (current != null) {
			if (current === existingNode) {
				const newNode = new Node(payload);
				newNode.prev = current;
				newNode.next = current.next;

				if (current.next) {
					current.next.prev = newNode;
				}
				current.next = newNode;
				return;
			}
			current = current.next;
		}
	}

	swapNodes(nodeA, nodeB) {
		if (nodeA === null || nodeB === null || nodeA === nodeB) {
			return;
		}

		const tempPrev = nodeA.prev;
		nodeA.prev = nodeB.prev;
		nodeB.prev = tempPrev;

		if (nodeA.prev) nodeA.prev.next = nodeA;
		if (nodeB.prev) nodeB.prev.next = nodeB;

		const tempNext = nodeA.next;
		nodeA.next = nodeB.next;
		nodeB.next = tempNext;

		if (nodeA.next) nodeA.next.prev = nodeA;
		if (nodeB.next) nodeB.next.prev = nodeB;

		if (this.head === nodeA) {
			this.head = nodeB;
		} else if (this.head === nodeB) {
			this.head = nodeA;
		}

		if (this.tail === nodeA) {
			this.tail = nodeB;
		} else if (this.tail === nodeB) {
			this.tail = nodeA;
		}
	}

	nodeAt(index) {
		let currentNode = this.head;
		let currentIndex = 0;

		while (currentNode !== null && currentIndex < index) {
			currentNode = currentNode.next;
			currentIndex++;
		}

		if (currentNode === null) {
			return null;
		}

		return currentNode;
	}

	get(index) {
		let node = this.nodeAt(index);

		if (node !== null) {
			return node.payload;
		}

		return null;
	}

	indexOf(payload) {
		if (this.head === null) {
			return -1;
		}
		let current = this.head;
		let index = 0;

		while (current != null) {

			if (current.payload === payload) {
				return index;
			}
			current = current.next;
			index++;
		}
		return -1;
	}

	insertBefore(index, payload) {
		if (index < 0) {
			throw new Error("Index out of bounds");
		}
		
		if (index === 0 || this.head === null) { 
			this.addFirst(payload);
			return;
		}
	
		let node = this.nodeAt(index);
		if (node === null) {
			throw new Error("Index out of bounds");
		}
	
		this.insertBeforeNode(payload, node);
	}
	
	insertAfter(index, payload) {
		if (index < 0) {
			throw new Error("Index out of bounds");
		}
	
		let node = this.nodeAt(index);
		if (node === null) {
			throw new Error("Index out of bounds");
		}
	
		this.insertAfterNode(payload, node);
	}
	

	first() {
		return this.head ? this.head.payload : null;
	}

	last() {
		return this.tail ? this.tail.payload : null;
	}


	remove(index) {
		if (index !== null) {
			let node = this.nodeAt(index);
			this.removeNode(node);
		}
	}

	dumpList() {
		let current = this.head;
		let index = 0;

		console.log("Dumping list:");

		while (current !== null) {
			console.log(`Node ${index}:`);
			console.log(`  Payload: ${current.payload}`);
			console.log(`  Prev: ${current.prev ? current.prev.payload : 'null'}`);
			console.log(`  Next: ${current.next ? current.next.payload : 'null'}`);
			console.log('-------------------');

			current = current.next;
			index++;
		}

		if (index === 0) {
			console.log("Listen er tom.");
		}
	}

	clear() {
		this.head = null;
		this.tail = null;
	}




}

const list = new LinkedList();
list.add('1');
list.add('2');
list.addFirst('0');
list.add('3');

/* list.dumpList()
console.log(list); */



