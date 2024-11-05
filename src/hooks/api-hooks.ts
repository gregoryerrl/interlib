import prisma from "@/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const connectToDatabase = async () => {
  try {
    await prisma.$connect;
  } catch (error) {
    console.log(error);
    throw new Error("unable to connect");
  }
};

export const handleHeaders = (
  isPrivate: boolean | undefined,
  isFile = false
) => {
  let headerOptions: HeadersInit = {
    "Content-Type": isFile ? "multipart/form-data" : "application/json",
  };

  if (isPrivate) {
    headerOptions = { ...headerOptions, token: "" };
  }
  return headerOptions;
};

export const callApi = async (
  tagType: TagTypes,
  apiRoute: string,
  apiMethod: string,
  apiBody: object | undefined,
  isPrivate: boolean | undefined,
  isRevalidate: boolean | undefined
) => {
  try {
    await connectToDatabase();
    const uri = process.env.NEXT_PUBLIC_URL;

    const headerOptions = await handleHeaders(isPrivate);

    const data = await fetch(`${uri}/${apiRoute}`, {
      method: apiMethod,
      headers: headerOptions,
      body: apiBody ? JSON.stringify(apiBody) : null,
      next: { revalidate: 3600, tags: [tagType] },
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    //error handling
    console.log(error);

    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  } finally {
    if (isRevalidate) revalidateTag(tagType);
    await prisma.$disconnect();
  }
};

type TagTypes = "paper";
