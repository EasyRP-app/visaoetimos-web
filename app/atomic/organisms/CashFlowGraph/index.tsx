import React, { useEffect } from 'react'

import { useGetCashFlowLazyQuery } from '@app/features/cash-flow/queries.generated'
import { Box } from '@chakra-ui/react'
import { getMonth } from 'date-fns'
import dynamic from 'next/dynamic'

const Column = dynamic(
  () => import('@ant-design/charts').then(mod => mod.Column as any),
  { ssr: false },
) as any

const CashFlowGraph = () => {
  const months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ]
  const [load, { data, called }] = useGetCashFlowLazyQuery({
    fetchPolicy: 'cache-and-network',
  })

  const formatValue = value => {
    return value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const cashFlows = data?.gerenateCashFlowByAccount

  const cashFlowTypes = cashFlows?.flatMap(cashFlow => {
    const type = cashFlow?.type

    const values = []
    cashFlow?.cashFlows?.map(item => {
      item?.finances?.nodes?.map(item => {
        values.push({
          month: getMonth(new Date(item?.issuedate)),
          value: item?.value,
        })
      })
    })

    const groupedValues = values.reduce((acc, cur) => {
      const month = cur.month
      const value = cur.value
      if (acc[month]) {
        acc[month] += value
      } else {
        acc[month] = value
      }

      return acc
    }, {})

    const result = Object.entries(groupedValues).map(
      ([month, totalValue]) => ({
        type,
        month: months[parseInt(month)],
        totalValue,
      }),
    )

    return result
  })

  console.log({ cashFlowTypes })

  const DemoColumn = () => {
    const config = {
      data: cashFlowTypes || [],
      isGroup: true,
      xField: 'month',
      yField: 'totalValue',
      width: 600,
      seriesField: 'type',
      dodgePadding: 2,
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle',
        // 'top', 'bottom', 'middle',
        // 配置样式
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
        layout: [
          // 柱形图数据标签位置自动调整
          {
            type: 'interval-adjust-position',
          }, // 数据标签防遮挡
          {
            type: 'interval-hide-overlap',
          }, // 数据标签文颜色自动调整
          {
            type: 'adjust-color',
          },
        ],
        content: ({ totalValue }) => formatValue(totalValue || 0),
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: '类别',
        },
        sales: {
          alias: 'total',
        },
      },
    }
    return <Column {...config} />
  }

  useEffect(() => {
    if (!called) load()
  }, [called, load])

  return (
    <Box backgroundColor="white" borderRadius="5px">
      <Box width={'min-content'} padding={'20px'}>
        <DemoColumn />
      </Box>
    </Box>
  )
}

export default CashFlowGraph