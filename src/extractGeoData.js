import fs from "fs";
import { centroid } from "@turf/turf";

const basePath = "./src/states"; // adjust if your files are in ./State/ or another folder
// List of states you want
const states = [
  "TAMIL NADU",
  "KERALA",
  "KARNATAKA",
  "ANDHRA PRADESH",
  "TELANGANA",
];
const allData = [];

for (const state of states) {
  const statePath = `${basePath}/${state}`;

  const files = fs.readdirSync(statePath);
  const districtFile = files.find(
    (f) => f.toLowerCase().includes("district") && f.endsWith(".geojson")
  );
  const subDistrictFile = files.find(
    (f) => f.toLowerCase().includes("subdistrict") && f.endsWith(".geojson")
  );
  const villageFile = files.find(
    (f) => f.toLowerCase().includes("village") && f.endsWith(".geojson")
  );

  console.log(`📍 Processing ${state}...`);

  const result = {
    state,
    districts: [],
  };

  // ✅ Districts
  if (districtFile) {
    const districtData = JSON.parse(
      fs.readFileSync(`${statePath}/${districtFile}`, "utf-8")
    );

    result.districts = districtData.features.map((d) => {
      const center = centroid(d);
      return {
        district:
          d.properties.DISTRICT || d.properties.name || d.properties.LOC_NAME,
        latitude: center.geometry.coordinates[1],
        longitude: center.geometry.coordinates[0],
        subDistricts: [],
      };
    });
  }

  // ✅ Sub Districts (Taluks)
  if (subDistrictFile) {
    const subData = JSON.parse(
      fs.readFileSync(`${statePath}/${subDistrictFile}`, "utf-8")
    );
    const subDistricts = subData.features.map((f) => {
      const center = centroid(f);
      return {
        name:
          f.properties.SUBDISTRICT ||
          f.properties.Taluk ||
          f.properties.sdtname,
        district: f.properties.DISTRICT || f.properties.dtname || "",
        latitude: center.geometry.coordinates[1],
        longitude: center.geometry.coordinates[0],
      };
    });

    console.log({ result: result.districts });
    // link subdistricts to their districts
    for (const sub of subDistricts) {
      const parent = result.districts.find(
        (district) =>
          district.district?.toLowerCase() === sub.district?.toLowerCase()
      );
      if (parent) parent.subDistricts.push(sub);
    }
  }

  // ✅ Villages
  if (villageFile) {
    const villageData = JSON.parse(
      fs.readFileSync(`${statePath}/${villageFile}`, "utf-8")
    );
    const villages = villageData.features.map((v) => {
      const center = centroid(v);
      return {
        name:
          v.properties.VILNAM_SOI ||
          v.properties.VILNAME11 ||
          v.properties.VILLAGE ||
          "",
        subDistrict:
          v.properties.SDTNAME ||
          v.properties.SUBDISTRICT ||
          v.properties.Taluk ||
          "",
        district: v.properties.DTNAME || v.properties.DISTRICT || "",
        latitude: center.geometry.coordinates[1],
        longitude: center.geometry.coordinates[0],
      };
    });

    // link villages to their subdistricts
    for (const dist of result.districts) {
      for (const sub of dist.subDistricts) {
        console.log({ sub });
        sub.villages = villages.filter(
          (v) => v.subDistrict?.toLowerCase() === sub.name?.toLowerCase()
        );
      }
    }
  }
  allData.push(result);
}

// ✅ Save the combined JSON
fs.writeFileSync("states_geo_data.json", JSON.stringify(allData, null, 2));

console.log("✅ Created states_geo_data.json successfully!");
