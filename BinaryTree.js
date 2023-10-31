class TNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr) {
        arr = removeDuplicates(arr);
        this.root = buildTree(arr, 0, arr.length -1);

    }

    insert(nodeToInsert, currentNode =this.root) {
        //base case
        if(currentNode == null) {
            currentNode = new TNode(nodeToInsert);
            return currentNode;
        }

        if(nodeToInsert < currentNode.data) currentNode.left = this.insert(nodeToInsert, currentNode.left);
        if(nodeToInsert > currentNode.data) currentNode.right = this.insert(nodeToInsert, currentNode.right);

        return currentNode;
    }

    delete(nodeToDelete, currentNode = this.root ) {
        //base case, we found the target to delete
        if (currentNode.data === nodeToDelete) {
            //check if the target is a leaf
            if (currentNode.left == null && currentNode.right == null) {
                 currentNode = null;
                 return currentNode;
            }
            //check for left child
            if (currentNode.left !== null && currentNode.right === null) return currentNode.left;
            //check for right child
            if (currentNode.left === null && currentNode.right !== null) return currentNode.right;
            //node has 2 childs
            if (currentNode.left && currentNode.right) {

                let succParent = currentNode;
                // Find successor
                let succ = currentNode.right;
                while (succ.left !== null) {
                  succParent = succ;
                  succ = succ.left;
                }

                if (succParent !== currentNode)
                {
                    succParent.left = succ.right;
                } else {
                    succParent.right = succ.right;
                }

                currentNode.data = succ.data;

                succ = null;
                return currentNode;
            }
        }

        if (nodeToDelete > currentNode.data) currentNode.right = this.delete(nodeToDelete, currentNode.right);
        if (nodeToDelete < currentNode.data) currentNode.left = this.delete(nodeToDelete, currentNode.left);

        return currentNode;
    }

    find(key, currentNode = this.root) {
        //base case
        //if we found the node return it, or if the node that we search isnt in our tree, return null
        if (currentNode === null || currentNode.data === key ) {
            return currentNode;
        }
        
        if (key > currentNode.data) return this.find(key, currentNode.right);
        if (key < currentNode.data) return this.find(key, currentNode.left);
        
    }

    levelOrder(callback = null) {
        const q = [];
        const arr = [];

        if(!callback) callback = node => arr.push(node);

        let currentNode = this.root;
        if (currentNode.left) q.push(currentNode.left);
        if (currentNode.right) q.push(currentNode.right);
        callback(currentNode);
        while (q.length !== 0) {
            const tmp = q.shift()
            //if there's no callback argument, the default function push items in the array
            callback(tmp);
            if (tmp.left) q.push(tmp.left);
            if (tmp.right) q.push(tmp.right);
        }
        //if the array is not empty returns it
        if(arr.length !== 0) return arr;
    } 
    
    preorder(callback = node => arr.push(node.data), currentNode = this.root, arr = []) {
        //base case
        if (currentNode === null) return;

        callback(currentNode);
        //recursive call
        this.inorder(callback, currentNode.left);
        this.inorder(callback, currentNode.right);
        //if no callback argument, then returns an array with the nodes
        if (currentNode === this.root && arr.length !== 0) return arr;
    }

    inorder(callback = node => arr.push(node.data), currentNode = this.root, arr = []) {
        //base case
        if (currentNode === null) return;

        //recursive call
        this.inorder(callback, currentNode.left);
        callback(currentNode);
        this.inorder(callback, currentNode.right);
        //if no callback argument, then returns an array with the nodes
        if (currentNode === this.root && arr.length !== 0) return arr;
    }

    postorder(callback = node => arr.push(node.data), currentNode = this.root, arr = []) {
       //base case
       if (currentNode === null) return;

       //recursive call
       this.inorder(callback, currentNode.left);
       this.inorder(callback, currentNode.right);
       callback(currentNode);
       //if no callback argument, then returns an array with the nodes
       if (currentNode === this.root && arr.length !== 0) return arr;
    }

    height(currentNode = this.root) {
        if (currentNode === null) return -1;

        const left = this.height(currentNode.left);
        const right = this.height(currentNode.right);
        
        return Math.max(left, right) + 1
    }

    depth(node, currentNode = this.root) {
        
        if (!(node instanceof TNode)) throw Error("You must pass a TNode as the argument!"); 
        if (node.data === currentNode.data) return 0;

        if (node.data > currentNode.data) return this.depth(node, currentNode.right) + 1;
        if (node.data < currentNode.data) return this.depth(node, currentNode.left) + 1;
    }

    isBalance() {
        let bIsBalance = true
        this.levelOrder(node => {
            if (!bIsBalance) return false;

            const leftHeight = this.height(node.left);
            const rightHeight = this.height(node.right);
            bIsBalance = ( Math.max(leftHeight, rightHeight) - Math.min(leftHeight, rightHeight) ) < 2;
        })
        return bIsBalance;
    }

    rebalance() {
        const arr = this.inorder();
        this.root = buildTree(arr, 0, arr.length)
    }
}

function buildTree(arr, start, end) {
    arr = mergeSort(arr);
    //base case
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const root = new TNode(arr[mid])
    //recursive call
    root.left = buildTree(arr, start, mid - 1);
    root.right = buildTree(arr, mid + 1, end);
    return root;
}

function mergeSort(arr)
{
    //Recursive base 
    if (arr.length < 2) return arr;
    
    let leftHalf = mergeSort(arr.slice(0, arr.length / 2));
    let rightHalf = mergeSort(arr.slice(arr.length / 2));
    let merged = [];

    while ( leftHalf.length > 0 || rightHalf.length > 0 ) {
            if (leftHalf[0] < rightHalf[0]) {
                merged.push(leftHalf[0]); 
                leftHalf.splice(0, 1);
            } else if (rightHalf[0] == undefined) {
                merged.push(leftHalf[0]); 
                leftHalf.splice(0, 1);
            } else {
                merged.push(rightHalf[0]);
                rightHalf.splice(0, 1)
            }  
    }

    return merged
}

function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index)
}


function prettyPrint (node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
  