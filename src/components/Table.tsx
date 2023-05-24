import { useTable, usePagination, type Column } from "react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  TableContainer,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { useMemo, useState, useEffect, useCallback } from "react";

export interface PaginatedData<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface RowAction<T> {
  callback: (row: T) => void;
  actionName: string;
  icon?: JSX.Element;
  shouldRender?: (row: T) => boolean;
}
export interface TableProps<T extends object> {
  columns: Column<T>[];
  actions?: RowAction<T>[];
  getData: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  refetchState: boolean; // force the table to rerender
}

const CustomTable = <T extends object>(props: TableProps<T>) => {
  const { columns, getData, actions } = props;
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [data, setData] = useState<PaginatedData<T>>({
    data: [],
    page: 0,
    perPage: 10,
    total: 0,
  });

  const fetchData = useCallback(async () => {
    const data = await getData(pagination.pageIndex, pagination.pageSize);
    setData(data);
  }, [getData, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (props.refetchState) {
      void fetchData();
    }
  }, [fetchData, props.refetchState]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    pageOptions,
    gotoPage,
  } = useTable<T>(
    {
      columns,
      data: data?.data || [],
      state: {
        pagination,
      },
      onPaginationChange: setPagination,
      manualPagination: true,
    },
    usePagination
  );
  return (
    <>
      <TableContainer rounded={"md"} w={"full"} overflowX={"auto"}>
        <Table {...getTableProps()} variant="striped">
          <Thead bg="blue.05">
            {headerGroups.map((headerGroup, i) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={`col-${i}`}>
                {headerGroup.headers.map((column, j) => (
                  <Th
                    {...column.getHeaderProps()}
                    color="white"
                    key={`col-header-${j}`}
                  >
                    {column.render("Header")}
                  </Th>
                ))}
                {actions && <Th color="white">Actions</Th>}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} w={"full"}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={`row-${i}`}>
                  {row.cells.map((cell, j) => (
                    <Td
                      {...cell.getCellProps()}
                      key={`cell-${j}`}
                      maxW={"400px"}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  {actions && (
                    <Td>
                      <VStack spacing={2} align={"flex-start"}>
                        {actions.map(
                          (action) =>
                            (action.shouldRender === undefined ||
                              action.shouldRender(row.values as T)) && (
                              <Button
                                leftIcon={action.icon}
                                variant={"link"}
                                onClick={() => action.callback(row.values as T)}
                                key={action.actionName}
                              >
                                {action.actionName}
                              </Button>
                            )
                        )}
                      </VStack>
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex flexDirection={"row-reverse"} w={"full"}>
        <Text flexShrink="0" color="text.third" mt={3}>
          Showing{" "}
          <Text as="span">
            {data?.total === 0
              ? 0
              : (pagination.pageIndex - 1) * pagination.pageSize + 1}
            {"-"}
            {Math.min(pagination.pageIndex * pagination.pageSize, data?.total)}
          </Text>{" "}
          of <Text as="span">{data?.total}</Text>
        </Text>
      </Flex>
      <HStack justifyContent="space-between" alignItems="center" w="full">
        <Tooltip label="Previous Page">
          <IconButton
            aria-label="Previous Page"
            onClick={() => {
              setPagination({
                pageIndex: pagination.pageIndex - 1,
                pageSize: pagination.pageSize,
              });
            }}
            isDisabled={pagination.pageIndex === 1}
            icon={<ChevronLeftIcon h={6} w={6} />}
          />
        </Tooltip>
        <HStack alignItems="center">
          <Text flexShrink="0">Go to page:</Text>{" "}
          <NumberInput
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value) => {
              const v = parseInt(value);
              const page = v ? v - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pagination.pageIndex}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pagination.pageSize}
            onChange={(e) => {
              setPagination({
                ...pagination,
                pageSize: Number(e.target.value),
              });
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </HStack>
        <Tooltip label="Next Page">
          <IconButton
            aria-label="Next Page"
            isDisabled={
              pagination.pageIndex ===
              Math.round((data?.total || 1) / pagination.pageSize)
            }
            onClick={() =>
              setPagination({
                pageIndex: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
              })
            }
            icon={<ChevronRightIcon h={6} w={6} />}
          />
        </Tooltip>
      </HStack>
    </>
  );
};

export default CustomTable;
