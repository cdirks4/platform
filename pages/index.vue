<script>
import {
  AppConfig,
  UserSession,
  showConnect,
  openSTXTransfer,
  openContractCall,
} from "@stacks/connect";
import { makeContractCall, broadcastTransaction } from "@stacks/transactions";
import { ref, onMounted } from "vue";

import { StacksTestnet, StacksDevnet } from "@stacks/network";
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from "@stacks/transactions";

export default {
  name: "App",
  setup() {
    const appConfig = new AppConfig(
      ["store_write", "publish_data"],
      "http://localhost:3999"
    );
    const depositAmount = ref();
    const userSession = new UserSession({ appConfig });
    const authOptions = {
      appDetails: {
        name: "Hello Stacks",
        icon: "http://localhost:3000/favicon.ico",
      },
      redirectTo: "/",
      manifestPath: "/manifest.json",
      onFinish: (param) => {
        console.log("finished login", { param });
        userData.value = userSession.loadUserData();
      },
      onCancel: (param) => {
        console.log("cancelled login", { param });
      },
    };
    const connectWallet = () => {
      showConnect(authOptions);
    };
    const userTransactionRef = ref(null);
    const testDeposit = async () => {
      console.log("hit");
      const test = await openContractCall({
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "lagoon",
        functionName: "deposit",
        functionArgs: [uintCV(Number(depositAmount.value))],
        onFinish: (data) => {
          console.log(data);
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
        onCancel: () => {
          console.log("cancel");
        },
      });
      console.log(test);
    };
    const testTransfer = async () => {
      const test = await openSTXTransfer({
        recipient: "ST1TZ0M4XTA1EHX5Z97Q69RP7PC8QAEMK95WCZXDF",
        amount: "10",
        memo: "Tester",
        network: new StacksDevnet(),
        onFinish: (data) => {
          console.log(data);
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
      });

      // const explorerTransactionUrl =
      // console.log("View transaction in explorer:", explorerTransactionUrl);
    };
    const userData = ref(null);

    onMounted(() => {
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then((data) => {
          userData.value = data;
          delete userData.value.authResponseToken;
          delete userData.value.gaiaAssociationToken;
        });
      } else if (userSession.isUserSignedIn()) {
        userData.value = userSession.loadUserData();
        delete userData.value.authResponseToken;
        delete userData.value.gaiaAssociationToken;
      }
    });
    return {
      depositAmount,
      testDeposit,
      testTransfer,
      connectWallet,
      userTransactionRef,
      userData,
      elevationData: [],
    };
  },
};
</script>

<template>
  <div class="h-screen">
    <nav class="flex items-center justify-between bg-black p-4 w-screen">
      <h1 class="text-6xl font-black text-white">Hello Stacks</h1>
      <button
        class="bg-white text-gray-800 rounded-lg py-2 px-4"
        @click="connectWallet"
      >
        Connect Wallet
      </button>
    </nav>
    <form
      @submit.prevent="testDeposit"
      class="max-w-md mx-auto flex-col flex justify-between gap-2 mt-2"
    >
      <input
        type="number"
        v-model="depositAmount"
        placeholder="Deposit Amount"
        id="depositAmount"
        class="border-[#E2E2E2] rounded-xl p-2 border-2 text-sm h-12 font-light"
      />
      <button
        type="submit"
        class="bg-gray-200 text-gray-800 rounded-lg py-2 px-4"
      >
        Submit
      </button>
    </form>
  </div>
</template>
