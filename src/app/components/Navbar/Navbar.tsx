"use server"

import Link from "next/link";
import pool from "@/lib/db"
import styles from "./Navbar.module.css"
import { RowDataPacket } from "mysql2";

interface NavigationData extends RowDataPacket {
    Name: string;
    Link: string;
}

interface FetchResult {
    Error: string | null;
    Data: NavigationData[]
}

async function fetchData(): Promise<FetchResult>
{
    let result:FetchResult = {
        Data: [],
        Error: null
    }
    try{
        const [rows] = await pool.query<NavigationData[]>("SELECT name AS Name,link AS Link FROM navigation")
        console.log(rows)
        if(rows.length <= 0){
            result.Error = "No data can be found"
        } else{
            result.Data = rows as NavigationData[]
        }
    }catch(error){
        result.Error = "Error exec query"
        console.error("Error query",error)
    }
    return result
}

export default async function Navbar(){

    const data = await fetchData()
    if(data.Error){
        return (
            <div className={styles.error}>{data.Error}</div>
        )
    }

    return (
        <nav>
            {data.Data.map((item) => {
                return (
                    <Link href={item.Link}>{item.Name}</Link>
                )
            })}
        </nav>
    )
}