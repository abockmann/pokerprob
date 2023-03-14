#include <fstream>
#include <emscripten.h>

static const char* TABLE_FILENAME = "table.dat";

static int* g_table = nullptr;
static int g_tableSize = 0;

extern "C"  {
EMSCRIPTEN_KEEPALIVE
void initTable()
{
    std::ifstream file(TABLE_FILENAME, std::ios::binary | std::ios::ate);
    std::streamsize fileSize = file.tellg();
    file.seekg(0, std::ios::beg);

    g_tableSize = static_cast<int>(fileSize) / sizeof(int);
    g_table = new int[g_tableSize];

    if (!file.read(reinterpret_cast<char*>(g_table), fileSize)) {
        throw std::runtime_error("Failed to read table file");
    }
}

EMSCRIPTEN_KEEPALIVE
int lookup(int index)
{
    if (!g_table) {
        initTable();
    }
    if (index < 0 || index >= g_tableSize) {
        throw std::out_of_range("Index out of range");
    }
    return g_table[index];
}
}