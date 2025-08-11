const colorMap = {
  "Bắt buộc chung": "#2196F3",
  "Bắt buộc chung nhóm ngành": "#00BCD4",
  "Cơ sở ngành": "#F44336",
  "Bổ trợ ngành": "#F8BBD0",
  "Chuyên ngành": "#FF9800",
  "Giáo dục chuyên nghiệp": "#9C27B0",
  "Thực tập": "#3F51B5",
  "Luận văn tốt nghiệp": "#4CAF50"
};

function transformData(classIds) {
  const semesterMap = {};
  classIds.forEach((item, index) => {
    const semId = item.semester;
    if (!semesterMap[semId]) {
      semesterMap[semId] = {
        id: semId,
        name: `Học kỳ ${semId}`,
        courses: []
      };
    }

    semesterMap[semId].courses.push({
      id: item.classId,
      name: item.courseName,
      credits: Number(item.credits),
      color: colorMap[item.courseType] || "#9E9E9E" // màu mặc định nếu không match
    });
  });

  // Trả về mảng các học kỳ được sắp xếp theo id
  return Object.values(semesterMap).sort((a, b) => a.id - b.id);
}

export default transformData;
