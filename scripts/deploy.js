//imports
const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    // const SimpleStorageFactory = hre.ethers.getContractFactory("SimpleStorage")
    // console.log("Deploying contract")
    // const simpleStorage = await SimpleStorageFactory.deploy()
    // await simpleStorage.deployed()
    // console.log(`contract deployed to: ${simpleStorage.address}`)
    const SimpleStorageFactory = await ethers.deployContract("SimpleStorage")
    await SimpleStorageFactory.waitForDeployment()
    console.log("Deploying....")
    console.log(
        `Deployed contract to ${await SimpleStorageFactory.getAddress()}`,
    )
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for blocks txes...")
        await SimpleStorageFactory.deploymentTransaction().wait(6);
        const addressContract = await SimpleStorageFactory.getAddress();
        await verify(addressContract,[])
    }

    const currentValue = await SimpleStorageFactory.retrieve()
    console.log(`retieved value is : ${currentValue}`)
    //update the current value
    console.log("calling store function...")
    const transactionResponse = await SimpleStorageFactory.store(7)
    console.log(" segundo stop")
    await SimpleStorageFactory.waitForDeployment(1)
    const updatedValue = await SimpleStorageFactory.retrieve()
    console.log(`updated value is : ${updatedValue}`)
}
async function verify(contractAddress, args) {
    console.log("Verifying Contract......")
    try {
        run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified")
        } else {
            console.log(e)
        }
    }
}
//call main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// const {ethers, run, network} = require("hardhat")

// async function main() {
//   const SimpleStorageFactory = await ethers.deployContract("SimpleStorage")
//   console.log("Deploying contract...")

//   await SimpleStorageFactory.waitForDeployment()
//   const simpleStorage = await SimpleStorageFactory.getAddress();
//   console.log("SimpleStorage Contract Address:", simpleStorage);
//   if(network.config === 11155111 && process.env.ETHERSCAN_API_KEY) {
//     await simpleStorage.deployTransaction.wait(6);
//     await verify(simpleStorage.address, []);
//   }
// }

// async function verify(contractAddress, args){
//   // This will verify our contract with the block Explorer Etherscan
//   console.log("Verifying contracts...")
//   try{ 
//   await run("verify:verify", {
//     address: contractAddress,
//     constructorArguments: args,

//   });
// } catch (e){
//   if(e.message.toLowercase().includes("already verified")){
//     console.log("Already Verified!")
//   } else {
//     console.log(e);
//   }
// }
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
