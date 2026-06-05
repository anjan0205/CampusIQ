import pandas as pd
import json
import re

def main():
    csv_path = 'D:/CollegeDunia/engineering-colleges-in-india/engineering colleges in India.csv'
    print("Loading dataset...")
    df = pd.read_csv(csv_path)

    # Clean rows
    df = df.dropna(subset=['College Name', 'City', 'State'])
    df['Rating_num'] = pd.to_numeric(df['Rating'], errors='coerce')
    df['Established Year'] = pd.to_numeric(df['Established Year'], errors='coerce')
    df['Average Fees'] = pd.to_numeric(df['Average Fees'], errors='coerce')

    # Filter for rows that have a valid NAAC Rating (approx 327 colleges)
    df_rated = df[df['Rating_num'].notnull()].copy()
    df_rated = df_rated.sort_values(by='Rating_num', ascending=False)

    colleges = []
    seen_slugs = set()

    for idx, row in df_rated.iterrows():
        name = str(row['College Name']).strip()
        # Clean whitespaces
        name = re.sub(r'\s+', ' ', name)
        
        # Clean up common suffix glitches in names
        if name.endswith(','):
            name = name[:-1].strip()

        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

        if name == "Vignan's Institute of Information Technology":
            name = "Vignan's Institute of Information Technology (VIIT), Duvvada"
            slug = "vignan-s-institute-of-information-technology-viit-duvvada"
        
        # Prevent duplicates
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        city = str(row['City']).strip()
        state = str(row['State']).strip()

        # Scale rating from [2.0, 3.85] to [4.0, 4.9] for premium CampusIQ scale
        orig_rating = row['Rating_num']
        orig_rating = max(2.0, min(3.85, orig_rating))
        scaled_rating = round(4.0 + (orig_rating - 2.0) * (0.9 / 1.85), 1)

        established = int(row['Established Year']) if not pd.isna(row['Established Year']) and row['Established Year'] > 1800 else 1980

        ownership = "Public" if "Government" in str(row['College Type']) or "Autonomous" in str(row['College Type']) else "Private"

        campus = str(row['Campus Size']).strip()
        if pd.isna(row['Campus Size']) or campus == "None" or campus == "":
            campus = "50 Acres"

        # Fees
        orig_fees = row['Average Fees']
        if pd.isna(orig_fees) or orig_fees <= 0:
            fees = 125000 if ownership == "Public" else 320000
        else:
            fees = round(float(orig_fees))
            if fees < 10000:
                # Fallback for placeholder fees in dataset
                fees = 125000 if ownership == "Public" else 320000

        # Placement metrics based on rating & ownership tier
        rating_factor = (scaled_rating - 4.0) / 0.9  # 0 to 1
        if ownership == "Public":
            avg_placement = round(6.0 + rating_factor * 12.0, 2)  # 6 to 18 LPA
            highest_pkg = round(avg_placement * (2.5 + rating_factor * 2.5), 1)  # 15 to 90 LPA
            median_pkg = round(avg_placement * 0.85, 2)
        else:
            avg_placement = round(4.5 + rating_factor * 8.0, 2)  # 4.5 to 12.5 LPA
            highest_pkg = round(avg_placement * (2.0 + rating_factor * 2.0), 1)  # 9 to 50 LPA
            median_pkg = round(avg_placement * 0.8, 2)

        # Ranks predictor ranges
        min_rank = max(100, int(15000 - rating_factor * 14500))
        max_rank = max(1000, int(80000 - rating_factor * 75000))

        # Courses extraction
        raw_courses = str(row['Courses'])
        courses_list = []
        if raw_courses and raw_courses != "nan" and raw_courses != "None":
            parts = [p.strip() for p in raw_courses.split('|')]
            parts = [p for p in parts if p]
            for p in parts[:3]:  # Top 3 B.Tech programs
                courses_list.append({
                    "courseName": f"B.Tech {p}",
                    "duration": "4 Years",
                    "fees": float(fees),
                    "eligibility": "10+2 with Physics, Chemistry, Mathematics + JEE Main"
                })
        if not courses_list:
            courses_list = [
                {"courseName": "B.Tech Computer Science & Engineering", "duration": "4 Years", "fees": float(fees), "eligibility": "10+2 with Physics, Chemistry, Mathematics + JEE Main"},
                {"courseName": "B.Tech Electronics & Communication", "duration": "4 Years", "fees": float(fees), "eligibility": "10+2 with Physics, Chemistry, Mathematics + JEE Main"}
            ]

        # Facilities
        raw_facilities = str(row['Facilities'])
        facilities_list = []
        if raw_facilities and raw_facilities != "nan" and raw_facilities != "None":
            facilities_list = [f.strip() for f in raw_facilities.split('|') if f.strip()]
        if not facilities_list:
            facilities_list = ["Library", "Hostel", "Sports", "WiFi", "Cafeteria"]
        facilities_list = facilities_list[:5]

        # University details
        university = str(row['University']).strip()
        if pd.isna(row['University']) or university == "None" or university == "":
            university = "State Technical University"

        # Description
        desc = f"Established in {established}, {name} is a leading {ownership.lower()} engineering institution located in {city}, {state}. It is affiliated with {university} and offers courses including {courses_list[0]['courseName']}. The campus is spread over {campus} and features infrastructure such as {', '.join(facilities_list)}. It is widely recognized for academic excellence with a rating of {scaled_rating}/5."

        # NIRF Ranking mapping
        nirf = int(180 - rating_factor * 170)
        if nirf < 1: 
            nirf = 1

        colleges.append({
            "name": name,
            "slug": slug,
            "location": city,
            "state": state,
            "fees": float(fees),
            "rating": float(scaled_rating),
            "nirfRanking": nirf,
            "establishedYear": established,
            "ownershipType": ownership,
            "campusSize": campus,
            "averagePlacement": float(avg_placement),
            "highestPackage": float(highest_pkg),
            "medianPackage": float(median_pkg),
            "examName": "JEE Main",
            "minRank": min_rank,
            "maxRank": max_rank,
            "courses": courses_list,
            "facilities": facilities_list,
            "description": desc
        })

    # Save to file
    with open('D:/CollegeDunia/prisma/engineering_colleges.json', 'w', encoding='utf-8') as f:
        json.dump(colleges, f, indent=2, ensure_ascii=False)

    print(f"Preprocessed {len(colleges)} colleges successfully!")

if __name__ == "__main__":
    main()
