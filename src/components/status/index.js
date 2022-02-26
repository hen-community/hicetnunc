import React, { useEffect } from 'react'
import styles from './styles.module.scss'
import { useState } from 'react'
import { VisuallyHidden } from '../visually-hidden'
import { fetchGraphQL, getDipdupState } from "../../data/hicdex";

export const Status = () => {
  const [status, setStatus] = useState({});
  const [statusDetails, setStatusDetails] = useState({});

  const checkIndexerStatus = async () => {
    try {
      const tzktResult = await fetch('https://api.tzkt.io/v1/head')
      if (tzktResult) {
        const tzktStatus = await tzktResult.json()
        if (tzktStatus) {
          const level1 = tzktStatus.level
          const dipdupState = await fetchGraphQL(getDipdupState)

          const result = dipdupState.data.hic_et_nunc_dipdup_state
          for (let index = 0; index < result.length; index++) {
              const node = result[index]
              if (node.index_name === "hen_mainnet"){
                let level2 = node.level
                if (level1 - level2 > 50){ // arbitrary blockchain level comparison
                  console.log(`Indexer problem: ${level1} vs ${level2} = ${level1 - level2}`)
                  setStatusDetails(`Indexer problem: The indexer is currently delayed (-${level1 - level2} blocks)`)
                  return false;
                }
                break
              }
            }
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    setStatusDetails("Indexer OK")
    return true;
  }

  useEffect(() => {
    checkIndexerStatus().then(d => setStatus(d));
  }, [])

  if (status){
    return null
  }

  return (
      <span
        className={styles.status}
        data-position={'bottom'}
        data-tooltip={statusDetails}
        style={{
          marginRight: '10px',
        }}
      >
        <VisuallyHidden>{`${statusDetails}`}</VisuallyHidden>
        {status ? "🟢" : "🔴"}
      </span>
  )
}
