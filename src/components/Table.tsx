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
  shouldRender? : (row: T) => boolean;
}
export interface TableProps<T extends object> {
  columns: Column<T>[];
  actions?: RowAction<T>[];
  getData: (page: number, perPage: number) => Promise<PaginatedData<T>>;
  refetchState: boolean; // force the table to rerender
}

const CustomTable = <T extends object>(props: TableProps<T>) => {
  const { columns, getData, actions } = props;
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const [_data, setData] = useState<PaginatedData<T>>({
    data: [],
    page: 0,
    perPage: 10,
    total: 0,
  });

  const fetchData = useCallback(async () => {
    const data = await getData(pageIndex, pageSize);
    setData(data);
  }, [getData, pageIndex, pageSize]);

  useEffect(() => {
    if (props.refetchState) {
      void fetchData();
    }
  }, [fetchData, props.refetchState]);

  const data = useMemo(() => _data, [_data]);

  const instance = useTable<T>(
    {
      columns,
      data: data?.data || [],
      state: {
        pagination,
      },
      onPaginationChange: setPagination,
    },
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance;
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
                    key={`col-header-${j}`
                  }
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
                        {actions.map((action) => (
                          (action.shouldRender === undefined || action.shouldRender(row.values as T)) && <Button
                            leftIcon={action.icon}
                            variant={"link"}
                            onClick={() => action.callback(row.values as T)}
                            key={action.actionName}
                          >
                            {action.actionName}
                          </Button>
                        ))}
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
            {data?.total === 0 ? 0 : (pageIndex - 1) * pageSize + 1}
            {"-"}
            {Math.min((pageIndex + 1) * pageSize, data?.total)}
          </Text>{" "}
          of <Text as="span">{data?.total}</Text>
        </Text>
      </Flex>
      <HStack justifyContent="space-between" alignItems="center" w="full">
        <HStack>
          <Tooltip label="First Page">
            <IconButton
              aria-label="First Page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Previous Page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </HStack>
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
            defaultValue={pageIndex}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </HStack>

        <HStack>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="Next Page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label="Last Page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
            />
          </Tooltip>
        </HStack>
      </HStack>
    </>
  );
};

export default CustomTable;
