/* eslint-disable react/prop-types */

import { useEffect, useState } from "react"
import Buttons from "./buttons"
import InputField from "./InputFields"
import { Download, FileText, Search } from "lucide-react"
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf"

// import 'jspdf-autotable';
import CustomDropdown from "./customDropdown"
import ActiveButtons from "./ActiveButtons";

let firstIndex = 0
let lastIndex = 10
let debounceTimer

function ReUseAbleTable({ loader = true, buttons, data, cols, handleRow, fetchData, filter = true, handleFileData, files = true }) {
  const [filterData, setFilterData] = useState([])
  const [active, setActive] = useState(0)

  const [totalPage, setTotalPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [stickyCol, setStickyCol] = useState(null)
  const [pageNo, setPageNo] = useState(1)

  const [sorting, setSorting] = useState({})

  const [filterValue, setFilteredValue] = useState("")


  const handleChange = async (ev, key) => {
    const { value } = ev.target;
    setFilteredValue(value === "" ? "" : value);
    firstIndex = 0;
    lastIndex = 10;
    setPageNo(1);


    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      dataSetter(value);
    }, 300);
  };



  const handlePagination = ((sign) => {
    if (sign === "+") {
      firstIndex += parseInt(perPage)
      lastIndex += parseInt(perPage)
      setPageNo(pageNo + 1)
    } else {
      firstIndex -= parseInt(perPage)
      lastIndex -= parseInt(perPage)
      setPageNo(pageNo - 1)
    }

    dataSetter()
  })
  useEffect(() => {
    setPageNo(1)
    setFilteredValue("")
    firstIndex = 0
    dataSetter()
  }, [cols, perPage, sorting, active])
  useEffect(() => {
    dataSetter()
  }, [data])
  useEffect(() => {
    setActive(0)
  }, [cols])


  const selectOption = [
    {
      name: 10,
      value: 10
    },
    {
      name: 20,
      value: 20
    },
    {
      name: 50,
      value: 50
    },
    {
      name: 100,
      value: 100
    }
  ]
  const dataSetter = async (value = "") => {

  try {
      setColumnFilters(cols)
      const stickRight = cols?.find(q => q.sticky)
      setStickyCol(stickRight)
      loader && setLoading(true)
      if (fetchData) {
        const countData = await fetchData(firstIndex, perPage, sorting?.order, sorting?.name || "", value.toLowerCase(), active)
        setFilterData(countData?.data)
        const count = Math.ceil(parseInt(countData?.totalCount) / perPage)
        setTotalPage(count === 0 ? 1 : count)
      } else {
        setFilterData(data?.slice(firstIndex, lastIndex))
        setTotalPage(Math.ceil(data?.length / perPage))
        const count = Math.ceil(parseInt(data?.length) / perPage)
        setTotalPage(count === 0 ? 1 : count)
      }
  } catch (error) {
    console.log(error);
  }
    loader &&
      setTimeout(() => {
        setLoading(false)
      }, 1000)
  }
  const countChange = async (ev) => {
    console.log(ev.target.value);
    lastIndex = ev.target.value
    setPerPage(ev.target.value)
  }

  const handleDownloadCsv = async () => {
    const data = await handleFileData(filterData)
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'data.csv');
  };
  const handleDownloadPdf = async () => {
    let doc = new jsPDF();

    const obj = await handleFileData(filterData);
    let heading;
    for (const data of obj) {
      heading = Object.keys(data);
      break;
    }

    const generatedData = obj.map((item) => Object.values(item));

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let autoTableOptions = {
      head: [heading],
      body: generatedData,
      startY: 10,
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
      headStyles: {
        fillColor: [112, 67, 128],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [236, 240, 241],
        textColor: [0, 0, 0],
      },
    };

    doc.autoTable(autoTableOptions);

    const tableWidth = doc.internal.pageSize.getWidth() - autoTableOptions.margin.left - autoTableOptions.margin.right;
    if (heading.length * 30 > tableWidth) {
      doc = new jsPDF('landscape');

      autoTableOptions = {
        ...autoTableOptions,
        startY: 10,
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      };

      doc.autoTable(autoTableOptions);
    }

    doc.save("doc.pdf");
  };


  const handleHeading = (name) => {
    if (!name) return
    let order = ""
    if (name === sorting?.name) {
      order = sorting?.order || ""
    }
    let newFlags = {};
    newFlags = { name, order: order === "ASC" ? "DESC" : order === "DESC" ? "" : "ASC" }
    setSorting(newFlags);
  };

  const handleSelectChange = (selectedOptions) => {
    setColumnFilters((prev) => {
      const updatedFilters = prev.map((filter) => {
        if (filter.name === selectedOptions.name) {
          return { ...filter, checked: !selectedOptions?.checked };
        }
        return filter;
      });
      return updatedFilters;
    });
  };

  return (
    <>

      <div className=" h-full">
        <ActiveButtons buttons={buttons} active={active} setActive={setActive} />
       
        <div className="flex">
          {stickyCol && columnFilters?.find(q => q.accessor === stickyCol.accessor).checked && (
            <div className=" min-w-48  flex flex-col">
              <span
                onClick={() => handleHeading(stickyCol?.accessor)}
                className={`rounded-tl-lg items-center justify-center   text-white flex gap-1 bg-primary whitespace-nowrap capitalize p-4 `}
              >
                {stickyCol.name}
              </span>
              {
                loading ? <div className="w-full p-4">
                  <span className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700   w-full mb-4" />
                  <span className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700  w-full mb-4" />
                  <span className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700  w-full mb-4" />
                  <span className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700  w-full mb-4" />
                  <span className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700  w-full mb-4" />
                </div>
                  :
                  <div className="flex flex-col items-stretch">
                    {filterData?.map((row, index) => (
                     
                      <div
                        key={index}
                        className={`bg-background border-t border-transparent capitalize ${stickyCol?.align === 'center' ? 'text-center' : stickyCol?.align === 'right' ? 'text-right' : 'text-left'
                          } flex-1`}
                      >
                        <div className="truncate py-2">{stickyCol?.cell ? stickyCol?.cell(row) : row?.[stickyCol.accessor]}</div>
                      </div>
                    ))}
                  </div>
              }

            </div>
          )}


          {columnFilters?.length > 0 && (
            <table className="grow block overflow-x-auto rounded-md md:w-[calc(100vw-320px-136px)] w-[calc(100vw-4rem-136px)]">
              <thead className="block">
                <tr className="flex">
                  {columnFilters?.map((header) => {
                    if (header.sticky) {
                      return null;
                    } else if (header.checked) {
                      return (
                        <td
                          key={header.name}
                          onClick={() => handleHeading(header?.accessor)}
                          className={`min-w-48 items-center flex gap-1 bg-background whitespace-nowrap capitalize p-4 ${header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-right' : 'text-left'
                            } ${header?.sticky ? 'sticky left-0 z-10 bg-primary text-white' : 'w-full'}`}
                        >
                          {header.name}
                          
                        </td>
                      );
                    }
                  })}
                </tr>
              </thead>
              {loading ? (
                <tbody role="status" className="flex gap-4 animate-pulse mt-4">
                  {columnFilters?.map((e, i) => {
                    if(e?.sticky){
                      return null
                    }
                    if(!e?.checked) return null
                    return <tr key={i} className="w-full">
                      <td className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700 min-w-44 w-full mb-4" />
                      <td className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700 min-w-44 w-full mb-4" />
                      <td className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700 min-w-44 w-full mb-4" />
                      <td className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700 min-w-44 w-full mb-4" />
                      <td className="h-3 block bg-gray-200 rounded-full dark:bg-gray-700 min-w-44 w-full mb-4" />
                    </tr>
                  }
                  )}
                </tbody>
              ) : (
                <tbody className="block">
                  {filterData?.length ? (
                    filterData?.map((row, i) => (
                      <tr
                        className={`flex  border-t border-border border-solid items-center `}
                        key={i}
                        onClick={() => {
                          handleRow && handleRow(row);
                        }}
                      >
                        {columnFilters?.map((filter, index) => {
                          if (filter.sticky) {
                            return null;
                          } else if (filter?.checked) {
                            return (
                              <td
                                key={index}
                                className={`min-w-48 capitalize p-4 ${filter?.align === 'center' ? 'text-center' : filter?.align === 'right' ? 'text-right' : 'text-left'
                                  } flex-1`}
                              >
                                <div className="truncate">{filter?.cell ? filter?.cell(row) : row?.[filter.accessor] || "-"}</div>
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr className="block">
                      <td className="block text-center mt-2" colSpan={columnFilters?.length}>
                        No results.
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          )}
        </div>


        <div className="flex items-center justify-end space-x-2 py-4">
          {/* <div className="flex-1 text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div> */}
          <div className="flex-1 text-sm text-muted-foreground">
            {pageNo} of {totalPage || 1} page(s).</div>
          <div className="flex gap-2 items-start">
            <select type="select" onChange={countChange} value={perPage} className="text-primary  border outline-none border-primary border-solid disabled:opacity-70 disabled:text-desc rounded text-sm  p-1"  >
              {
                selectOption?.map((option, i) => {
                  return <option key={i} value={option?.value}>{option?.name}</option>

                })
              }
            </select>
            <Buttons
              spinner={false}
              onClick={() => handlePagination("-")}
              disabled={pageNo === 1}
              type="border"
            >
              Previous
            </Buttons>

            <Buttons
              spinner={false}
              onClick={() => handlePagination("+")}
              disabled={pageNo === (totalPage)}
              type="border"
            >
              Next
            </Buttons>
          </div>
        </div>
      </div>

    </>

  )
}


export default ReUseAbleTable
