<script>
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";

import { callReadOnlyFunction } from "@stacks/transactions";
import logo from "../assets/images/logo.svg";
import conference1Image from "@/assets/images/conference1.jpeg";
import conference2Image from "@/assets/images/conference2.jpeg";
import conference3Image from "@/assets/images/conference3.jpeg";
import { ref, onMounted } from "vue";

import { StacksMocknet } from "@stacks/network";
import { uintCV } from "@stacks/transactions";

export default {
  name: "App",
  data() {
    return {
      showConferences: false,
      conferences: [
        {
          id: 1,
          name: "Corporate Conference",
          image: conference1Image,
          price: 99.99,
        },
        {
          id: 2,
          name: "Science Convention",
          image: conference2Image,
          price: 149.99,
        },
        {
          id: 2,
          name: "Bussiness Conference 2040",
          image: conference3Image,
          price: 149.99,
        },
        // Add more conferences here
      ],
    };
  },
  setup() {
    const appConfig = new AppConfig(
      ["store_write", "publish_data"],
      "http://localhost:3999"
    );
    const depositAmount = ref();
    const borrowAmount = ref();
    const repayAmount = ref();

    const showConferences = ref(false); //......................
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
    //.....................................

    const currentFrame = ref(1);

    const showFrame1 = () => {
      currentFrame.value = 1;
    };

    const showFrame2 = () => {
      currentFrame.value = 2;
    };

    //............................................
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
      <!-- <button
        class="bg-[#422397] text-gray-800 rounded-lg py-2 px-4 text-white"
        @click="showConferences = !showConferences"
      >
        {{ showConferences ? "Home" : "Conference" }}
      </button> -->
    </nav>
    <div id="frame1" v-show="!showConferences">
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
          <button
            type="submit"
            class="bg-black text-white rounded-lg py-2 px-4"
          >
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
          <button
            type="submit"
            class="bg-black text-white rounded-lg py-2 px-4"
          >
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
          <button
            type="submit"
            class="bg-black text-white rounded-lg py-2 px-4"
          >
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

      <NuxtLink
        v-if="userTransactionRef"
        :to="userTransactionRef"
        class="w-[60%]"
      >
        {{ userTransactionRef }}
      </NuxtLink>
    </div>

    <div
      id="frame2"
      v-show="showConferences"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="conference in conferences"
        :key="conference.id"
        class="conference-tile"
      >
        <img
          :src="conference.image"
          :alt="conference.name"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold">{{ conference.name }}</h3>
          <p class="text-gray-600">Price: ${{ conference.price }}</p>
          <button class="bg-blue-500 text-white py-2 px-4 rounded mt-2">
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.conference-tile {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
  height: 400px;
  width: 300px;
}

.conference-tile img {
  @apply object-cover;
}
</style>
