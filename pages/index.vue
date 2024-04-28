<script>
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";

import { callReadOnlyFunction } from "@stacks/transactions";
import logo from "../assets/images/logo.svg";
import { ref, onMounted } from "vue";

import { StacksMocknet } from "@stacks/network";
import { uintCV } from "@stacks/transactions";

export default {
  name: "App",
  setup() {
    const appConfig = new AppConfig(
      ["store_write", "publish_data"],
      "http://localhost:3999"
    );
    const depositAmount = ref();
    const borrowAmount = ref();
    const repayAmount = ref();
    const userSession = new UserSession({ appConfig });
    const userOwes = ref(null);
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
      await openContractCall({
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "lagoon",
        functionName: "deposit",
        functionArgs: [uintCV(Number(depositAmount.value))],
        onFinish: (data) => {
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
        onCancel: () => {
          console.log("cancel");
        },
        network: new StacksMocknet(),
      });
    };
    const repayLoan = async () => {
      await openContractCall({
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "lagoon",
        functionName: "repay",
        functionArgs: [uintCV(Number(repayAmount.value))],
        onFinish: (data) => {
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
        onCancel: () => {
          console.log("cancel");
        },
        network: new StacksMocknet(),
      });
      userOwes.value = 1200;
    };

    const testBorrow = async () => {
      await openContractCall({
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "lagoon",
        functionName: "borrow",
        functionArgs: [uintCV(Number(borrowAmount.value))],
        onFinish: (data) => {
          console.log(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`
          );
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
        onCancel: () => {
          console.log("cancel");
        },
        network: new StacksMocknet(),
      });
    };
    const getAmountOwed = async () => {
      const res = await callReadOnlyFunction({
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "lagoon",
        functionName: "get-amount-owed",
        network: new StacksMocknet(),
        senderAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        functionArgs: [],
        onFinish: (data) => {
          console.log(data);
          userTransactionRef.value = `https://explorer.hiro.so/txid/${data.txId}?chain=testnet&api=http://localhost:${3999}`;
        },
        onCancel: () => {
          console.log("cancelled");
        },
      });
      console.log(res);
      userOwes.value = res.value.value;
    };

    const userData = ref(null);

    onMounted(async () => {
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then((data) => {
          userData.value = data;
          getAmountOwed();
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
      userOwes,
      logo,
      depositAmount,
      repayLoan,
      getAmountOwed,
      testBorrow,
      testDeposit,
      connectWallet,
      borrowAmount,
      userTransactionRef,
      userData,
      repayAmount,
      elevationData: [],
    };
  },
};
</script>

<template>
  <div class="h-screen">
    <nav
      class="flex items-center justify-between bg-white p-4 w-screen shadow-lg mb-6"
    >
      <div class="flex items-center gap-2">
        <img :src="logo" />
        <h1 class="font-bold text-xl">Renaissance</h1>
      </div>
      <button
        class="bg-[#422397] text-gray-800 rounded-lg py-2 px-4 text-white"
        @click="connectWallet"
      >
        {{
          `${userData?.profile?.stxAddress?.testnet.substring(0, 12)}...` ||
          "Connect Wallet"
        }}
      </button>
    </nav>
    <div class="max-w-md mx-auto flex-col flex justify-between gap-2 mt-2">
      <form
        @submit.prevent="testDeposit"
        class="max-w-md flex-col flex justify-between gap-2 mt-2"
      >
        <label for="deposit">Deposit:</label>
        <input
          type="number"
          v-model="depositAmount"
          placeholder="Deposit Amount"
          id="depositAmount"
          class="border-[#E2E2E2] rounded-xl p-2 border-2 text-sm h-12 font-light"
        />
        <button type="submit" class="bg-black text-white rounded-lg py-2 px-4">
          Submit
        </button>
      </form>

      <form
        @submit.prevent="repayLoan"
        class="max-w-md flex-col flex justify-between gap-2 mt-2"
      >
        <label for="repay">Repay loan amount</label>
        <input
          type="number"
          v-model="repayAmount"
          placeholder="Repay loan amount"
          id="repay"
          class="border-[#E2E2E2] rounded-xl p-2 border-2 text-sm h-12 font-light"
        />
        <button type="submit" class="bg-black text-white rounded-lg py-2 px-4">
          Submit
        </button>
      </form>
      <form
        @submit.prevent="testBorrow"
        class="max-w-md flex-col flex justify-between gap-2 mt-2"
      >
        <label for="repay">Borrow amount</label>
        <input
          type="number"
          v-model="borrowAmount"
          placeholder="Repay loan amount"
          id="repay"
          class="border-[#E2E2E2] rounded-xl p-2 border-2 text-sm h-12 font-light"
        />
        <button type="submit" class="bg-black text-white rounded-lg py-2 px-4">
          Submit
        </button>
      </form>
      <h2>Claim Yield</h2>
      <button
        @click="testClaim"
        class="bg-yellow-500 text-gray-800 rounded-lg py-2 px-4"
      >
        Claim
      </button>
      <div>{{ userOwes }}</div>
      <button
        class="bg-black text-white rounded-lg py-2 px-4"
        @click="getAmountOwed"
      >
        View Amount Owed
      </button>
    </div>
    <!-- <div v-if="userData" class="w-[60%]">
      {{ userData.profile.stxAddress.testnet }}
    </div> -->
    <NuxtLink
      v-if="userTransactionRef"
      :to="userTransactionRef"
      class="w-[60%]"
    >
      {{ userTransactionRef }}
    </NuxtLink>
  </div>
</template>
