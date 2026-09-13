"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { fetchValidated } from "./fetch-validated"

export type FetchValidatedState<TData> = {
  status: "loading" | "success" | "error"
  data: TData | null
  errorMessage: string | null
}

function createLoadingState<TData>(): FetchValidatedState<TData> {
  return {
    status: "loading",
    data: null,
    errorMessage: null,
  }
}

function errorMessageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected error"
}

export function useFetchValidated<TSchema extends z.ZodType>(
  url: string,
  schema: TSchema
): {
  state: FetchValidatedState<z.infer<TSchema>>
  actions: { reload: () => void }
} {
  const [state, setState] = useState<FetchValidatedState<z.infer<TSchema>>>(
    createLoadingState
  )
  const [reloadToken, setReloadToken] = useState(0)
  const [activeUrl, setActiveUrl] = useState(url)

  if (activeUrl !== url) {
    setActiveUrl(url)
    setState(createLoadingState())
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchValidated(url, schema, {
          cache: "no-store",
        })

        if (!cancelled) {
          setState({
            status: "success",
            data,
            errorMessage: null,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            data: null,
            errorMessage: errorMessageOf(error),
          })
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [url, schema, reloadToken])

  return {
    state,
    actions: {
      reload: () => {
        setState(createLoadingState())
        setReloadToken((token) => token + 1)
      },
    },
  }
}
